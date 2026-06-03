from django.urls import path
from .views import ProjectView, ProjectDetailView

urlpatterns = [
    path('', ProjectView.as_view(), name='Project'),
    path('<int:project_id>/', ProjectDetailView.as_view(), name='Project detail')
]
