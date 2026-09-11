from .models import InitialAssessmentResponse
from django.contrib.auth.models import User
from rest_framework import serializers

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


class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ["id", "name", "script", "locale_code"]


class LearnerSerializer(serializers.ModelSerializer):
    name = serializers.CharField(
        source="user.get_full_name",
        read_only=True
    )
    email = serializers.EmailField(
        source="user.email",
        read_only=True
    )
    learning_language_name = serializers.CharField(
        source="learning_language.name",
        read_only=True
    )
    proficiency_level_display = serializers.CharField(
        source="get_proficiency_level_display",
        read_only=True
    )

    class Meta:
        model = Learner
        fields = [
            "id",
            "name",
            "email",
            "age",
            "learning_language",
            "learning_language_name",
            "proficiency_level",
            "proficiency_level_display",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class RegisterSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=150)

    email = serializers.EmailField()

    password = serializers.CharField(
        write_only=True,
        min_length=6
    )

    age = serializers.IntegerField(
        required=False,
        allow_null=True
    )

    learning_language = serializers.PrimaryKeyRelatedField(
        queryset=Language.objects.all()
    )

    proficiency_level = serializers.ChoiceField(
        choices=[1, 2, 3, 4],
        required=False,
        default=1
    )

    def validate_email(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError(
                "An account with this email already exists."
            )

        return value

    def create(self, validated_data):
        full_name = validated_data["full_name"]

        first_name, *rest = full_name.split(" ", 1)

        last_name = rest[0] if rest else ""

        user = User.objects.create_user(
            username=validated_data["email"],
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=first_name,
            last_name=last_name,
        )

        learner = Learner.objects.create(
            user=user,
            age=validated_data.get("age"),
            learning_language=validated_data["learning_language"],
            proficiency_level=validated_data.get(
                "proficiency_level",
                1
            ),
        )

        return learner


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = "__all__"


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = "__all__"


class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = "__all__"


class AssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assessment
        fields = "__all__"


class QuestionSerializer(serializers.ModelSerializer):
    answers = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = "__all__"

    def get_answers(self, obj):
        return [
            {
                "id": answer.id,
                "option_text": answer.option_text,
            }
            for answer in Answer.objects.filter(question=obj)
        ]


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = "__all__"


class AssessmentAttemptSerializer(serializers.ModelSerializer):
    assessment_title = serializers.CharField(
        source="assessment.title",
        read_only=True
    )

    learner_name = serializers.CharField(
        source="learner.user.get_full_name",
        read_only=True
    )

    class Meta:
        model = AssessmentAttempt
        fields = [
            "id",
            "learner",
            "learner_name",
            "assessment",
            "assessment_title",
            "attempt_number",
            "status",
            "score",
            "level_assigned",
            "started_at",
            "completed_at",
        ]

        read_only_fields = [
            "id",
            "learner",
            "attempt_number",
            "score",
            "level_assigned",
            "started_at",
            "completed_at",
        ]


class AssessmentResponseSerializer(serializers.ModelSerializer):
    question_text = serializers.CharField(
        source="question.prompt_text",
        read_only=True
    )

    question_type = serializers.CharField(
        source="question.question_type",
        read_only=True
    )

    class Meta:
        model = AssessmentResponse
        fields = [
            "id",
            "attempt",
            "question",
            "question_text",
            "question_type",
            "learner_answer",
            "correct_answer",
            "score",
            "is_correct",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "correct_answer",
            "score",
            "is_correct",
            "created_at",
        ]


class AssessmentResultSerializer(serializers.ModelSerializer):
    assessment_title = serializers.CharField(
        source="assessment.title",
        read_only=True
    )

    class Meta:
        model = AssessmentResult
        fields = [
            "id",
            "learner",
            "assessment",
            "assessment_title",
            "score",
            "level_assigned",
            "taken_at",
        ]

        read_only_fields = [
            "id",
            "learner",
            "taken_at",
        ]


class LearningProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearningProgress
        fields = "__all__"


class RecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recommendation
        fields = "__all__"


class AssessmentSubmitSerializer(serializers.Serializer):
    answers = serializers.DictField(
        child=serializers.CharField(
            allow_blank=True
        )
    )
    class InitialAssessmentResponseSerializer(serializers.ModelSerializer):
     class Meta:
        model = InitialAssessmentResponse
        fields = [
            "id",
            "learner",
            "learning_language",
            "learning_goal",
            "language_exposure",
            "reading_level",
            "writing_level",
            "comprehension_level",
            "profile_score",
            "starting_level",
            "completed_at",
        ]

        read_only_fields = [
            "id",
            "learner",
            "profile_score",
            "starting_level",
            "completed_at",
        ]