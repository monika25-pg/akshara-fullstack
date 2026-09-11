from django.core.management.base import BaseCommand

from core.models import (
    Language,
    Course,
    Lesson,
    Topic,
    Assessment,
    Question,
    Answer,
)


class Command(BaseCommand):
    help = "Seed Akshara multilingual learning content and assessments."

    def handle(self, *args, **options):

        # ================================================================
        # LANGUAGES
        # ================================================================

        english, _ = Language.objects.get_or_create(
            name="English",
            defaults={
                "script": "Latin",
                "locale_code": "en",
            },
        )

        hindi, _ = Language.objects.get_or_create(
            name="Hindi",
            defaults={
                "script": "Devanagari",
                "locale_code": "hi",
            },
        )

        kannada, _ = Language.objects.get_or_create(
            name="Kannada",
            defaults={
                "script": "Kannada",
                "locale_code": "kn",
            },
        )

        telugu, _ = Language.objects.get_or_create(
            name="Telugu",
            defaults={
                "script": "Telugu",
                "locale_code": "te",
            },
        )

        tamil, _ = Language.objects.get_or_create(
            name="Tamil",
            defaults={
                "script": "Tamil",
                "locale_code": "ta",
            },
        )

        # ================================================================
        # ENGLISH COURSE
        # Keep the existing English content.
        # ================================================================

        english_course, _ = Course.objects.get_or_create(
            title="Foundations of Reading & Writing",
            language=english,
            defaults={
                "description": (
                    "A starter course for neo-learners covering "
                    "reading, writing, vocabulary and comprehension."
                ),
                "level_required": 1,
            },
        )

        english_reading, _ = Lesson.objects.get_or_create(
            course=english_course,
            sequence_no=1,
            defaults={
                "title": "Morning at the Farm",
                "content_type": "reading",
                "body": (
                    "The sun rises over the field. "
                    "Ramu wakes up early. "
                    "He waters the small plants near his house."
                ),
            },
        )

        english_writing, _ = Lesson.objects.get_or_create(
            course=english_course,
            sequence_no=2,
            defaults={
                "title": "Trace & Write",
                "content_type": "writing",
                "body": (
                    "Practice writing these everyday words: "
                    "sun, water, house, plant."
                ),
            },
        )

        english_vocabulary, _ = Lesson.objects.get_or_create(
            course=english_course,
            sequence_no=3,
            defaults={
                "title": "Everyday Words",
                "content_type": "vocabulary",
                "body": (
                    "water, house, sun, plant, morning, field"
                ),
            },
        )

        english_comprehension, _ = Lesson.objects.get_or_create(
            course=english_course,
            sequence_no=4,
            defaults={
                "title": "What did Ramu do?",
                "content_type": "comprehension",
                "body": (
                    "The sun rises over the field. "
                    "Ramu wakes up early. "
                    "He waters the small plants near his house."
                ),
            },
        )

        # ================================================================
        # KANNADA COURSE
        # ================================================================

        kannada_course, _ = Course.objects.get_or_create(
            title="ಓದು ಮತ್ತು ಬರವಣಿಗೆಯ ಮೂಲಭೂತ ಪಾಠಗಳು",
            language=kannada,
            defaults={
                "description": (
                    "ಹೊಸ ಕಲಿಕಾರ್ಥಿಗಳಿಗಾಗಿ ಓದು, ಬರವಣಿಗೆ, "
                    "ಪದಸಂಪತ್ತು ಮತ್ತು ಅರ್ಥಗ್ರಹಣದ ಮೂಲಭೂತ ಪಾಠಗಳು."
                ),
                "level_required": 1,
            },
        )

        kannada_reading, _ = Lesson.objects.get_or_create(
            course=kannada_course,
            sequence_no=1,
            defaults={
                "title": "ಹೊಲದಲ್ಲಿ ಬೆಳಗ್ಗೆ",
                "content_type": "reading",
                "body": (
                    "ಸೂರ್ಯನು ಹೊಲದ ಮೇಲೆ ಉದಯಿಸುತ್ತಾನೆ. "
                    "ರಾಮು ಬೇಗನೆ ಎದ್ದೇಳುತ್ತಾನೆ. "
                    "ಅವನು ತನ್ನ ಮನೆಯ ಬಳಿಯಿರುವ ಸಣ್ಣ ಗಿಡಗಳಿಗೆ ನೀರು ಹಾಕುತ್ತಾನೆ."
                ),
            },
        )

        kannada_writing, _ = Lesson.objects.get_or_create(
            course=kannada_course,
            sequence_no=2,
            defaults={
                "title": "ಬರೆಯಿರಿ ಮತ್ತು ಅಭ್ಯಾಸ ಮಾಡಿ",
                "content_type": "writing",
                "body": (
                    "ಈ ದೈನಂದಿನ ಪದಗಳನ್ನು ಬರೆಯುವ ಅಭ್ಯಾಸ ಮಾಡಿ: "
                    "ಸೂರ್ಯ, ನೀರು, ಮನೆ, ಗಿಡ."
                ),
            },
        )

        kannada_vocabulary, _ = Lesson.objects.get_or_create(
            course=kannada_course,
            sequence_no=3,
            defaults={
                "title": "ದೈನಂದಿನ ಪದಗಳು",
                "content_type": "vocabulary",
                "body": (
                    "ನೀರು, ಮನೆ, ಸೂರ್ಯ, ಗಿಡ, ಬೆಳಗ್ಗೆ, ಹೊಲ"
                ),
            },
        )

        kannada_comprehension, _ = Lesson.objects.get_or_create(
            course=kannada_course,
            sequence_no=4,
            defaults={
                "title": "ರಾಮು ಏನು ಮಾಡಿದನು?",
                "content_type": "comprehension",
                "body": (
                    "ಸೂರ್ಯನು ಹೊಲದ ಮೇಲೆ ಉದಯಿಸುತ್ತಾನೆ. "
                    "ರಾಮು ಬೇಗನೆ ಎದ್ದೇಳುತ್ತಾನೆ. "
                    "ಅವನು ತನ್ನ ಮನೆಯ ಬಳಿಯಿರುವ ಸಣ್ಣ ಗಿಡಗಳಿಗೆ ನೀರು ಹಾಕುತ್ತಾನೆ."
                ),
            },
        )

        # ================================================================
        # TOPICS
        # ================================================================

        reading_topic, _ = Topic.objects.get_or_create(
            lesson=kannada_reading,
            name="ಮೂಲಭೂತ ಓದು",
            skill_area="reading",
        )

        writing_topic, _ = Topic.objects.get_or_create(
            lesson=kannada_writing,
            name="ಮೂಲಭೂತ ಬರವಣಿಗೆ",
            skill_area="writing",
        )

        comprehension_topic, _ = Topic.objects.get_or_create(
            lesson=kannada_comprehension,
            name="ಓದು ಅರ್ಥಗ್ರಹಣ",
            skill_area="comprehension",
        )

        # ================================================================
        # KANNADA READING ASSESSMENT
        # ================================================================

        reading_assessment, _ = Assessment.objects.get_or_create(
            topic=reading_topic,
            title="ಓದು ಮೌಲ್ಯಮಾಪನ — ಹಂತ 1",
            type="reading",
            level_target=1,
        )

        if not reading_assessment.questions.exists():

            q1 = Question.objects.create(
                assessment=reading_assessment,
                language=kannada,
                prompt_text=(
                    "ಬಾಯಾರಿಕೆಯಾದಾಗ ಕುಡಿಯುವ ವಸ್ತು ಯಾವುದು?"
                ),
                question_type="mcq",
                order=1,
            )

            Answer.objects.bulk_create([
                Answer(
                    question=q1,
                    option_text="ನೀರು",
                    is_correct=True,
                ),
                Answer(
                    question=q1,
                    option_text="ಮನೆ",
                    is_correct=False,
                ),
                Answer(
                    question=q1,
                    option_text="ಹೊಲ",
                    is_correct=False,
                ),
                Answer(
                    question=q1,
                    option_text="ಬೆಳಗ್ಗೆ",
                    is_correct=False,
                ),
            ])

            q2 = Question.objects.create(
                assessment=reading_assessment,
                language=kannada,
                prompt_text=(
                    "ವಾಕ್ಯವನ್ನು ಓದಿ: "
                    "“ರಾಮು ಬೇಗನೆ ಎದ್ದೇಳುತ್ತಾನೆ.” "
                    "ರಾಮು ಏನು ಮಾಡುತ್ತಾನೆ?"
                ),
                question_type="mcq",
                order=2,
            )

            Answer.objects.bulk_create([
                Answer(
                    question=q2,
                    option_text="ಅವನು ಬೇಗನೆ ಎದ್ದೇಳುತ್ತಾನೆ.",
                    is_correct=True,
                ),
                Answer(
                    question=q2,
                    option_text="ಅವನು ಮಲಗುತ್ತಾನೆ.",
                    is_correct=False,
                ),
                Answer(
                    question=q2,
                    option_text="ಅವನು ಶಾಲೆಗೆ ಹೋಗುತ್ತಾನೆ.",
                    is_correct=False,
                ),
                Answer(
                    question=q2,
                    option_text="ಅವನು ಮರವನ್ನು ಕಡಿಯುತ್ತಾನೆ.",
                    is_correct=False,
                ),
            ])

            q3 = Question.objects.create(
                assessment=reading_assessment,
                language=kannada,
                prompt_text=(
                    "ವಾಕ್ಯವನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ: "
                    "ಸೂರ್ಯನು ಹೊಲದ ಮೇಲೆ ___ ."
                ),
                question_type="fill_blank",
                order=3,
            )

            Answer.objects.create(
                question=q3,
                option_text="ಉದಯಿಸುತ್ತಾನೆ",
                is_correct=True,
            )

        # ================================================================
        # KANNADA WRITING ASSESSMENT
        # ================================================================

        writing_assessment, _ = Assessment.objects.get_or_create(
            topic=writing_topic,
            title="ಬರವಣಿಗೆ ಮೌಲ್ಯಮಾಪನ — ಹಂತ 1",
            type="writing",
            level_target=1,
        )

        if not writing_assessment.questions.exists():

            Question.objects.create(
                assessment=writing_assessment,
                language=kannada,
                prompt_text=(
                    "ನೀವು ವಾಸಿಸುವ ಸ್ಥಳಕ್ಕೆ ಕನ್ನಡದಲ್ಲಿ ಪದವನ್ನು ಬರೆಯಿರಿ."
                ),
                question_type="writing",
                order=1,
            )

            Question.objects.create(
                assessment=writing_assessment,
                language=kannada,
                prompt_text=(
                    "ಸೂರ್ಯನ ಬಗ್ಗೆ ಒಂದು ಕನ್ನಡ ವಾಕ್ಯವನ್ನು ಬರೆಯಿರಿ."
                ),
                question_type="writing",
                order=2,
            )

            Question.objects.create(
                assessment=writing_assessment,
                language=kannada,
                prompt_text=(
                    "ಈ ಪದವನ್ನು ಬರೆಯಿರಿ: ನೀರು"
                ),
                question_type="writing",
                order=3,
            )

        # ================================================================
        # KANNADA COMPREHENSION ASSESSMENT
        # ================================================================

        comprehension_assessment, _ = (
            Assessment.objects.get_or_create(
                topic=comprehension_topic,
                title="ಅರ್ಥಗ್ರಹಣ ಮೌಲ್ಯಮಾಪನ — ಹಂತ 1",
                type="comprehension",
                level_target=1,
            )
        )

        if not comprehension_assessment.questions.exists():

            q1 = Question.objects.create(
                assessment=comprehension_assessment,
                language=kannada,
                prompt_text=(
                    "ಪಾಠದಲ್ಲಿರುವ ವ್ಯಕ್ತಿಯ ಹೆಸರು ಏನು?"
                ),
                question_type="mcq",
                order=1,
            )

            Answer.objects.bulk_create([
                Answer(
                    question=q1,
                    option_text="ರಾಮು",
                    is_correct=True,
                ),
                Answer(
                    question=q1,
                    option_text="ಅರುಣ್",
                    is_correct=False,
                ),
                Answer(
                    question=q1,
                    option_text="ರವಿ",
                    is_correct=False,
                ),
                Answer(
                    question=q1,
                    option_text="ಕಿರಣ್",
                    is_correct=False,
                ),
            ])

            q2 = Question.objects.create(
                assessment=comprehension_assessment,
                language=kannada,
                prompt_text=(
                    "ರಾಮು ಯಾವುದಕ್ಕೆ ನೀರು ಹಾಕುತ್ತಾನೆ?"
                ),
                question_type="mcq",
                order=2,
            )

            Answer.objects.bulk_create([
                Answer(
                    question=q2,
                    option_text="ಸಣ್ಣ ಗಿಡಗಳಿಗೆ",
                    is_correct=True,
                ),
                Answer(
                    question=q2,
                    option_text="ಮನೆಗೆ",
                    is_correct=False,
                ),
                Answer(
                    question=q2,
                    option_text="ಹೊಲಕ್ಕೆ",
                    is_correct=False,
                ),
                Answer(
                    question=q2,
                    option_text="ರಸ್ತೆಗೆ",
                    is_correct=False,
                ),
            ])

            q3 = Question.objects.create(
                assessment=comprehension_assessment,
                language=kannada,
                prompt_text=(
                    "ರಾಮು ಯಾವಾಗ ಎದ್ದೇಳುತ್ತಾನೆ?"
                ),
                question_type="mcq",
                order=3,
            )

            Answer.objects.bulk_create([
                Answer(
                    question=q3,
                    option_text="ಬೇಗನೆ",
                    is_correct=True,
                ),
                Answer(
                    question=q3,
                    option_text="ರಾತ್ರಿಯಲ್ಲಿ",
                    is_correct=False,
                ),
                Answer(
                    question=q3,
                    option_text="ಮಧ್ಯಾಹ್ನ",
                    is_correct=False,
                ),
                Answer(
                    question=q3,
                    option_text="ಊಟದ ನಂತರ",
                    is_correct=False,
                ),
            ])

        # ================================================================
        # FINISHED
        # ================================================================

        self.stdout.write(
            self.style.SUCCESS(
                "Multilingual Akshara content seeded successfully."
            )
        )

        self.stdout.write(
            "Languages: English, Hindi, Kannada, Telugu, Tamil"
        )

        self.stdout.write(
            "Kannada course and Kannada assessments created successfully."
        )