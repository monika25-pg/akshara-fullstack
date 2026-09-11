from rest_framework import permissions


class IsOwnerLearner(permissions.BasePermission):
    """Allows access only to the learner who owns the object (obj.learner == request.user.learner)."""

    def has_object_permission(self, request, view, obj):
        return getattr(obj, "learner_id", None) == request.user.learner.id


class ReadOnlyOrAdmin(permissions.BasePermission):
    """Anyone (including anonymous visitors) can read (list/retrieve) —
    needed so the registration form can show languages and the Learn page
    can be browsed before signing in. Only staff/admin can write."""

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)


class AuthReadOnlyOrAdmin(permissions.BasePermission):
    """Signed-in learners can read (list/retrieve); only staff/admin can write.
    Used for assessments/questions, which should only be visible once logged in."""

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return bool(request.user and request.user.is_authenticated)
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)
