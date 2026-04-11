from rest_framework import serializers
from .models import Departments,Issues,Priority,CustomUser

class departmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Departments
        fields = '__all__'

class prioritySerializer(serializers.ModelSerializer):
    class Meta:
        model = Priority
        fields = '__all__'

class userSerializer(serializers.ModelSerializer):
    department = departmentSerializer()
    class Meta:
        model = CustomUser
        fields = ['id','username','first_name','last_name','email','phone_number','department']

class issuesSerializer(serializers.ModelSerializer):
    priority = prioritySerializer()
    requester = userSerializer()
    assigned = userSerializer()

    class Meta:
        model = Issues
        fields = '__all__'