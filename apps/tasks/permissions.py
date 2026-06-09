from rest_framework.permissions import BasePermission
from .models import Comment


class IsCommentOwner(BasePermission):
    def has_permission(self, request, view):
        comment_id = view.kwargs.get('comment_id')
        return Comment.objects.filter(
            user=request.user,
            id=comment_id
        ).exists()