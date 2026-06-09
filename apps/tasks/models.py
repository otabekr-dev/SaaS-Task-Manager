from django.db import models
from apps.projects.models import Project
from django.contrib.auth import get_user_model

User = get_user_model()

class Task(models.Model):
    class Status(models.TextChoices):
        TODO = 'TODO', 'Todo'
        IN_PROGRESS = 'IN_PROGRESS', 'In_Progress'
        DONE = 'DONE', 'Done'

    title = models.CharField(max_length=128)
    description = models.TextField(null=True, blank=True)
    owner = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name='owned_tasks')
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tasks')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True ,related_name='assigned_tasks')
    status = models.CharField(choices=Status.choices, default=Status.TODO)    

    created_at = models.DateTimeField(auto_now_add=True)    


class Comment(models.Model):
    text = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='comments')
    
    created_at = models.DateTimeField(auto_now_add=True)
