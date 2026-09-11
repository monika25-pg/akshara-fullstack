from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from . import views


router = DefaultRouter()

router.register(r"languages", views.LanguageViewSet)
router.register(r"courses", views.CourseViewSet)
router.register(r"lessons", views.LessonViewSet)
router.register(r"topics", views.TopicViewSet)
router.register(r"assessments", views.AssessmentViewSet)
router.register(r"questions", views.QuestionViewSet)


urlpatterns = [
    # Auth
    path(
        "auth/register/",
        views.RegisterView.as_view(),
        name="register",
    ),

    path(
        "auth/login/",
        views.LoginView.as_view(),
        name="login",
    ),

    path(
        "auth/refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh",
    ),

    path(
        "learners/me/",
        views.MeView.as_view(),
        name="learner_me",
    ),

    # Assessment actions
    path(
        "assessments/<uuid:pk>/start/",
        views.StartAssessmentView.as_view(),
        name="assessment_start",
    ),

    path(
        "assessments/<uuid:pk>/submit/",
        views.SubmitAssessmentView.as_view(),
        name="assessment_submit",
    ),

    path(
        "results/me/",
        views.MyResultsView.as_view(),
        name="my_results",
    ),

    # Progress / Recommendation
    path(
        "progress/me/",
        views.MyProgressView.as_view(),
        name="my_progress",
    ),

    path(
        "progress/update/",
        views.UpdateProgressView.as_view(),
        name="progress_update",
    ),

    path(
        "recommendations/me/",
        views.MyRecommendationsView.as_view(),
        name="my_recommendations",
    ),

    # CRUD resources
    path(
        "",
        include(router.urls),
    ),
    path(
    "initial-assessment/submit/",
    views.InitialAssessmentSubmitView.as_view(),
    name="initial_assessment_submit",
),
]
