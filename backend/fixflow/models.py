from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

class Departments(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=250)

class CustomUser(AbstractUser):
    department = models.ForeignKey(Departments,null=True,on_delete=models.SET_NULL)
    phone_number = models.CharField(max_length=15)
    is_manager = models.BooleanField(null=False,default=False)

class Priority(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=250)

class Issues(models.Model):
    class Status(models.TextChoices):
        # Format: VARIABLE = "database_value", "Display Label"
        OPEN = "Open", "Open"
        IN_PROGRESS = "In Progress", "In Progress"
        CLOSED = "Closed", "Closed"

    id = models.AutoField(primary_key=True)
    date_created = models.DateTimeField(default=timezone.now)
    date_updated = models.DateTimeField(default=timezone.now)
    title = models.CharField(max_length=250)
    description = models.CharField(max_length=800)
    location = models.CharField(max_length=250)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.OPEN)
    department = models.ForeignKey(Departments,null=False,on_delete=models.SET_DEFAULT,default=1)
    priority = models.ForeignKey(Priority,null=False,on_delete=models.SET_DEFAULT,default=1)
    requester = models.ForeignKey(CustomUser,null=False,on_delete=models.PROTECT,related_name='requested_issues') # CANNOT DELETE USER THAT OPENED AN ISSUE
    assigned = models.ForeignKey(CustomUser,null=False,on_delete=models.PROTECT,related_name='assigned_issues') # CANNOT DELETE USER THAT IS ASSIGNED TO AN ISSUE
