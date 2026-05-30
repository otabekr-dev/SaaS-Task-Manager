from django.contrib import admin
from .models import WorkSpace, WorkSpaceMember

admin.site.register([WorkSpace, WorkSpaceMember])