from django.urls import path
from .views import TaskView, TaskDetailView, CommentView, CommentDetailView


urlpatterns = [
    path('', TaskView.as_view(), name='task-list'),
    path('<int:task_id>/', TaskDetailView.as_view(), name='task-detail'),
    path('<int:task_id>/comments/', CommentView.as_view(), name='comments'),
    path('<int:task_id>/comments/<id:comments_id>/', CommentDetailView.as_view(), name='comment-detail')
]
