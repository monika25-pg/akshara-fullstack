from django.db import models

# your existing Language, Learner, Course, Lesson,
# Topic, Assessment, Question, etc. models go here


class InitialAssessmentResponse(models.Model):
    learner = models.OneToOneField(
        Learner,
        on_delete=models.CASCADE,
        related_name="initial_assessment",
    )

    learning_language = models.ForeignKey(
        Language,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="initial_assessment_responses",
    )

    learning_goal = models.CharField(
        max_length=100,
        blank=True,
    )

    language_exposure = models.CharField(
        max_length=100,
        blank=True,
    )

    reading_level = models.CharField(
        max_length=100,
        blank=True,
    )

    writing_level = models.CharField(
        max_length=100,
        blank=True,
    )

    comprehension_level = models.CharField(
        max_length=100,
        blank=True,
    )

    profile_score = models.PositiveIntegerField(
        default=0,
    )

    starting_level = models.CharField(
        max_length=50,
        default="Beginner",
    )

    completed_at = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):
        return f"{self.learner.name} - Initial Assessment"