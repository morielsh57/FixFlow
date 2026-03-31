from django.contrib import admin
from . import models
# Register your models here.
admin.site.register(models.CustomUser)
admin.site.register(models.Departments)
admin.site.register(models.Issues)
admin.site.register(models.Priority)