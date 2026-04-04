from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .serializers import departmentSerializer,issuesSerializer,prioritySerializer,userSerializer
from .models import Departments,Issues,Priority,CustomUser

@api_view(['GET'])
def index(request):
    return Response("hello",status=status.HTTP_200_OK)

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

"""
@api_view(['GET','POST','PATCH'])   # MUST - PICK ONE / MORE
def FUNC_NAME(request):             # MUST - PICK FUNC NAME
    pass                            #

"""

