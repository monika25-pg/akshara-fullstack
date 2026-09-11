from decimal import Decimal
from .models import InitialAssessmentResponse
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import viewsets, generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import (
    Language,
    Learner,
    Course,
    Lesson,
    Topic,
    Assessment,
    Question,
    Answer,
    AssessmentAttempt,
    AssessmentResponse,
    AssessmentResult,
    LearningProgress,
    Recommendation,
)

from .serializers import (
    LanguageSerializer,
    LearnerSerializer,
    RegisterSerializer,
    CourseSerializer,
    LessonSerializer,
    TopicSerializer,
    AssessmentSerializer,
    QuestionSerializer,
    AnswerSerializer,
    AssessmentAttemptSerializer,
    AssessmentResponseSerializer,
    AssessmentSubmitSerializer,
    AssessmentResultSerializer,
    LearningProgressSerializer,
    RecommendationSerializer,
)

from .permissions import ReadOnlyOrAdmin, AuthReadOnlyOrAdmin


# ---------------------------------------------------------------------------
# Auth
# ---------------------------------------------------------------------------

class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    SimpleJWT uses username for login.
    Akshara stores the learner's email as the username.
    """

    def validate(self, attrs):
        data = super().validate(attrs)

        learner = getattr(self.user, "learner", None)

        if learner:
            data["learner"] = LearnerSerializer(learner).data

        return data


class LoginView(TokenObtainPairView):
    """
    POST /api/auth/login/

    {
        "username": "<email>",
        "password": "..."
    }
    """

    serializer_class = EmailTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    """
    Creates User + Learner and returns JWT tokens.
    """

    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        learner = serializer.save()

        refresh = RefreshToken.for_user(learner.user)

        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "learner": LearnerSerializer(learner).data,
            },
            status=status.HTTP_201_CREATED,
        )


class MeView(generics.RetrieveUpdateAPIView):
    """
    GET/PATCH the signed-in learner's own profile.
    """

    serializer_class = LearnerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.learner


# ---------------------------------------------------------------------------
# Reference data
# ---------------------------------------------------------------------------

class LanguageViewSet(viewsets.ModelViewSet):
    queryset = Language.objects.all()
    serializer_class = LanguageSerializer
    permission_classes = [ReadOnlyOrAdmin]


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [ReadOnlyOrAdmin]
    filterset_fields = ["language", "level_required"]


class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [ReadOnlyOrAdmin]
    filterset_fields = ["course", "content_type"]


class TopicViewSet(viewsets.ModelViewSet):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    permission_classes = [ReadOnlyOrAdmin]


# ---------------------------------------------------------------------------
# Assessment
# ---------------------------------------------------------------------------

class AssessmentViewSet(viewsets.ModelViewSet):
    queryset = Assessment.objects.all()
    serializer_class = AssessmentSerializer
    permission_classes = [AuthReadOnlyOrAdmin]


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [AuthReadOnlyOrAdmin]


class StartAssessmentView(APIView):
    """
    POST /api/assessments/<id>/start/

    Creates a new assessment attempt for the signed-in learner.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        assessment = get_object_or_404(
            Assessment,
            pk=pk
        )

        learner = request.user.learner

        previous_attempts = (
            AssessmentAttempt.objects
            .filter(
                learner=learner,
                assessment=assessment,
            )
            .count()
        )

        attempt = AssessmentAttempt.objects.create(
            learner=learner,
            assessment=assessment,
            attempt_number=previous_attempts + 1,
            status="started",
        )

        return Response(
            AssessmentAttemptSerializer(attempt).data,
            status=status.HTTP_201_CREATED,
        )


class SubmitAssessmentView(APIView):
    """
    POST /api/assessments/<id>/submit/

    Expected format:

    {
        "answers": {
            "<question_id>": "<answer_id or text>"
        }
    }

    Completes the learner's latest started attempt.

    If no started attempt exists, a new attempt is created
    for backward compatibility.
    """

    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request, pk):
        assessment = get_object_or_404(
            Assessment,
            pk=pk
        )

        serializer = AssessmentSubmitSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        submitted = serializer.validated_data["answers"]

        learner = request.user.learner

        questions = list(
            assessment.questions.all()
        )

        total_questions = len(questions)

        # ---------------------------------------------------------------
        # Reuse the latest started attempt
        # ---------------------------------------------------------------
        attempt = (
            AssessmentAttempt.objects
            .filter(
                learner=learner,
                assessment=assessment,
                status="started",
            )
            .order_by("-started_at")
            .first()
        )

        # ---------------------------------------------------------------
        # Backward compatibility:
        # if no started attempt exists, create one
        # ---------------------------------------------------------------
        if attempt is None:

            previous_attempts = (
                AssessmentAttempt.objects
                .filter(
                    learner=learner,
                    assessment=assessment,
                )
                .count()
            )

            attempt = AssessmentAttempt.objects.create(
                learner=learner,
                assessment=assessment,
                attempt_number=previous_attempts + 1,
                status="started",
            )

        correct = 0
        scored_questions = 0

        # ---------------------------------------------------------------
        # Save every learner response
        # ---------------------------------------------------------------
        for question in questions:

            question_id = str(question.id)

            learner_value = submitted.get(
                question_id,
                ""
            )

            learner_value = str(
                learner_value or ""
            ).strip()

            question_type = getattr(
                question,
                "question_type",
                "mcq",
            )

            correct_answer_text = ""
            is_correct = None
            question_score = Decimal("0")

            correct_answer = (
                Answer.objects
                .filter(
                    question=question,
                    is_correct=True,
                )
                .first()
            )

            if correct_answer:
                correct_answer_text = (
                    correct_answer.option_text
                )

            # -----------------------------------------------------------
            # MCQ / True-False
            # -----------------------------------------------------------
            if question_type in ["mcq", "truefalse"]:

                scored_questions += 1

                selected_answer = None

                if learner_value:

                    selected_answer = (
                        Answer.objects
                        .filter(
                            id=learner_value,
                            question=question,
                        )
                        .first()
                    )

                if selected_answer:

                    learner_answer_text = (
                        selected_answer.option_text
                    )

                    is_correct = (
                        selected_answer.is_correct
                    )

                    if is_correct:

                        correct += 1
                        question_score = Decimal("1")

                else:

                    learner_answer_text = learner_value

            # -----------------------------------------------------------
            # Fill blank / Short text
            # -----------------------------------------------------------
            elif question_type in [
                "fill_blank",
                "short_text",
            ]:

                scored_questions += 1

                learner_answer_text = learner_value

                if correct_answer_text:

                    is_correct = (
                        learner_value.casefold()
                        == correct_answer_text.strip().casefold()
                    )

                    if is_correct:

                        correct += 1
                        question_score = Decimal("1")

            # -----------------------------------------------------------
            # Writing
            # -----------------------------------------------------------
            elif question_type == "writing":

                # Writing responses are stored for later
                # AI/manual analysis.
                learner_answer_text = learner_value

                is_correct = None

                question_score = Decimal("0")

            # -----------------------------------------------------------
            # Other text-based question
            # -----------------------------------------------------------
            else:

                learner_answer_text = learner_value

                if correct_answer_text:

                    scored_questions += 1

                    is_correct = (
                        learner_value.casefold()
                        == correct_answer_text.strip().casefold()
                    )

                    if is_correct:

                        correct += 1
                        question_score = Decimal("1")

            # -----------------------------------------------------------
            # Save response
            # -----------------------------------------------------------
            AssessmentResponse.objects.create(
                attempt=attempt,
                question=question,
                learner_answer=learner_answer_text,
                correct_answer=correct_answer_text,
                score=question_score,
                is_correct=is_correct,
            )

        # ---------------------------------------------------------------
        # Calculate score
        # ---------------------------------------------------------------
        if scored_questions:

            pct = (
                Decimal(correct)
                / Decimal(scored_questions)
                * Decimal("100")
            )

        else:

            pct = Decimal("0")

        pct = max(
            Decimal("0"),
            min(
                Decimal("100"),
                pct,
            ),
        )

        # ---------------------------------------------------------------
        # Assign proficiency level
        # ---------------------------------------------------------------
        if pct >= 85:

            level = 4

        elif pct >= 65:

            level = 3

        elif pct >= 40:

            level = 2

        else:

            level = 1

        # ---------------------------------------------------------------
        # Complete the existing attempt
        # ---------------------------------------------------------------
        attempt.status = "completed"

        attempt.score = pct

        attempt.level_assigned = level

        attempt.completed_at = timezone.now()

        attempt.save(
            update_fields=[
                "status",
                "score",
                "level_assigned",
                "completed_at",
            ]
        )

        # ---------------------------------------------------------------
        # Update learner proficiency
        # ---------------------------------------------------------------
        learner.proficiency_level = level

        learner.save(
            update_fields=[
                "proficiency_level"
            ]
        )

        # ---------------------------------------------------------------
        # Create assessment result
        # ---------------------------------------------------------------
        result = AssessmentResult.objects.create(
            learner=learner,
            assessment=assessment,
            score=pct,
            level_assigned=level,
        )

        # ---------------------------------------------------------------
        # Get saved responses
        # ---------------------------------------------------------------
        responses = (
            AssessmentResponse.objects
            .filter(
                attempt=attempt
            )
            .order_by("created_at")
        )

        # ---------------------------------------------------------------
        # Return complete result
        # ---------------------------------------------------------------
        return Response(
            {
                "correct": correct,
                "total": total_questions,
                "scored_questions": scored_questions,
                "score": float(pct),
                "level_assigned": level,

                "attempt": AssessmentAttemptSerializer(
                    attempt
                ).data,

                "responses": AssessmentResponseSerializer(
                    responses,
                    many=True
                ).data,

                "result": AssessmentResultSerializer(
                    result
                ).data,
            },
            status=status.HTTP_200_OK,
        )


class MyResultsView(generics.ListAPIView):
    serializer_class = AssessmentResultSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return (
            AssessmentResult.objects
            .filter(
                learner=self.request.user.learner
            )
            .order_by("-taken_at")
        )


# ---------------------------------------------------------------------------
# Progress / Recommendation
# ---------------------------------------------------------------------------

class MyProgressView(generics.ListAPIView):
    serializer_class = LearningProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return (
            LearningProgress.objects
            .filter(
                learner=self.request.user.learner
            )
        )


class UpdateProgressView(APIView):
    """
    POST /api/progress/update/

    {
        "lesson": "<lesson_id>",
        "percent_complete": 40
    }

    Creates or updates the learner's progress row.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        learner = request.user.learner

        lesson_id = request.data.get(
            "lesson"
        )

        pct = int(
            request.data.get(
                "percent_complete",
                0
            )
        )

        lesson = get_object_or_404(
            Lesson,
            pk=lesson_id
        )

        progress, _ = (
            LearningProgress.objects
            .get_or_create(
                learner=learner,
                lesson=lesson,
            )
        )

        progress.percent_complete = min(
            100,
            max(
                progress.percent_complete,
                pct,
            ),
        )

        progress.status = (
            "completed"
            if progress.percent_complete >= 100
            else "in_progress"
            if progress.percent_complete > 0
            else "not_started"
        )

        progress.save()

        # ---------------------------------------------------------------
        # Create recommendation after lesson completion
        # ---------------------------------------------------------------
        if progress.status == "completed":

            next_lesson = (
                Lesson.objects
                .filter(
                    course=lesson.course,
                    sequence_no__gt=lesson.sequence_no,
                )
                .order_by("sequence_no")
                .first()
            )

            if next_lesson:

                Recommendation.objects.get_or_create(
                    learner=learner,
                    lesson=next_lesson,
                    defaults={
                        "reason": (
                            f"You completed "
                            f"'{lesson.title}' — "
                            f"try this next."
                        )
                    },
                )

        return Response(
            LearningProgressSerializer(
                progress
            ).data
        )


class MyRecommendationsView(generics.ListAPIView):
    serializer_class = RecommendationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return (
            Recommendation.objects
            .filter(
                learner=self.request.user.learner
            )
        )
    class InitialAssessmentSubmitView(APIView):
      permission_classes = [IsAuthenticated]
    def post(self, request):
        learner = request.user.learner
        learning_goal = request.data.get("learning_goal", "")
        language_exposure = request.data.get("language_exposure", "")
        reading_level = request.data.get("reading_level", "")
        writing_level = request.data.get("writing_level", "")
        comprehension_level = request.data.get(
            "comprehension_level",
            "",
        )
        learning_language = request.data.get(
            "learning_language"
        )

        if not learning_goal:
            return Response(
                {"detail": "Learning goal is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not language_exposure:
            return Response(
                {"detail": "Language exposure is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not reading_level:
            return Response(
                {"detail": "Reading level is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not writing_level:
            return Response(
                {"detail": "Writing level is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not comprehension_level:
            return Response(
                {"detail": "Comprehension level is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Score questions 2-5.
        # Each answer is worth 1-5 points.
        score_map = {
            "I am completely new to it": 1,
            "I know a few words": 2,
            "I understand common words": 3,
            "I understand simple sentences": 4,
            "I use the language regularly": 5,

            "I cannot read it yet": 1,
            "I recognize a few letters or characters": 2,
            "I can read some words": 3,
            "I can read simple sentences": 4,
            "I can read paragraphs": 5,

            "I cannot write it yet": 1,
            "I can write a few letters or characters": 2,
            "I can write some words": 3,
            "I can write simple sentences": 4,
            "I can write comfortably": 5,

            "I do not understand it": 1,
            "I understand a few words": 2,
            "I understand common phrases": 3,
            "I understand simple conversations": 4,
            "I understand most everyday conversations": 5,
        }

        score = (
            score_map.get(language_exposure, 1)
            + score_map.get(reading_level, 1)
            + score_map.get(writing_level, 1)
            + score_map.get(comprehension_level, 1)
        )

        # Maximum = 20
        if score <= 7:
            starting_level = "Beginner"
        elif score <= 11:
            starting_level = "Elementary"
        elif score <= 15:
            starting_level = "Developing"
        else:
            starting_level = "Intermediate"

        language = None

        if learning_language:
            try:
                language = Language.objects.get(
                    id=learning_language
                )
            except Language.DoesNotExist:
                return Response(
                    {"detail": "Learning language not found."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        assessment, created = (
            InitialAssessmentResponse.objects.update_or_create(
                learner=learner,
                defaults={
                    "learning_language": language,
                    "learning_goal": learning_goal,
                    "language_exposure": language_exposure,
                    "reading_level": reading_level,
                    "writing_level": writing_level,
                    "comprehension_level": comprehension_level,
                    "profile_score": score,
                    "starting_level": starting_level,
                },
            )
        )

        return Response(
            {
                "message": "Initial assessment completed.",
                "score": score,
                "maximum_score": 20,
                "starting_level": starting_level,
                "learning_goal": learning_goal,
                "learning_language": (
                    language.name
                    if language
                    else None
                ),
                "assessment": (
                    InitialAssessmentResponseSerializer(
                        assessment
                    ).data
                ),
            },
            status=status.HTTP_200_OK,
        )