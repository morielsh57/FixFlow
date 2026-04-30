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

class get_userSerializer(serializers.ModelSerializer):
    department = departmentSerializer()
    class Meta:
        model = CustomUser
        fields = ['id','username','first_name','last_name','email','phone_number','department','is_manager','theme']

class edit_userSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['first_name','last_name','email','phone_number','department','is_manager','theme']


class get_issuesSerializer(serializers.ModelSerializer):
    department = departmentSerializer()
    priority = prioritySerializer()
    requester = get_userSerializer()
    assigned = get_userSerializer()

    class Meta:
        model = Issues
        fields = '__all__'

class add_edit_issuesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issues
        fields = '__all__'