from django.contrib import admin
from .models import (
    Language, Learner, Course, Lesson, Topic, Assessment,
    Question, Answer, AssessmentResult, LearningProgress, Recommendation,
)

admin.site.register(Language)
admin.site.register(Learner)
admin.site.register(Course)
admin.site.register(Lesson)
admin.site.register(Topic)
admin.site.register(Assessment)
admin.site.register(Question)
admin.site.register(Answer)
admin.site.register(AssessmentResult)
admin.site.register(LearningProgress)
admin.site.register(Recommendation)
