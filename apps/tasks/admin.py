from django.contrib import admin
from .models import Task, Comment

admin.site.register([Task, Comment])