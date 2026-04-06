from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .serializers import departmentSerializer,issuesSerializer,prioritySerializer,userSerializer
from .models import Departments,Issues,Priority,CustomUser
from django.shortcuts import get_object_or_404
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

"""
@api_view(['GET','POST','PATCH'])   # MUST - PICK ONE / MORE
def FUNC_NAME(request):             # MUST - PICK FUNC NAME
    pass                            #

"""

@api_view(['GET'])
def index(request):
    return Response("hello",status=status.HTTP_200_OK)


#####################
#                   #
#       USER        #
#                   #
#####################


@api_view(['POST'])
def create_user(request):
    input = request.data
    try:
        validate_password(input['password'])
    except ValidationError as e:
        return Response(e,status=status.HTTP_400_BAD_REQUEST)
    try:
        user = CustomUser.objects.create_user(
            username=input["username"],
            first_name=input["first_name"],
            last_name=input["last_name"],
            email=input["email"],
            department=input["department"],
            phone_number=input["phone_number"],
            password=input['password'],
        )
        user.save()
        return Response("User created successfully",status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response(f"user creation failed: {e}",status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH'])
def change_password(request):
    input = request.data
    try:
        user = CustomUser.objects.get(username=input["username"])
    except Exception as e:
        return Response("user not found", status=status.HTTP_404_NOT_FOUND)
    
    try:
        validate_password(input['password'])
    except ValidationError as e:
        return Response(e,status=status.HTTP_400_BAD_REQUEST)
    
    user.set_password(input['password'])
    user.save()
    return Response("password updated successfully",status=status.HTTP_200_OK)


#####################
#                   #
#       LOGIN       #
#                   #
#####################


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


#####################
#                   #
#      issues       #
#                   #
#####################


@api_view(['GET'])
def tickets(request):
    open_tickets = Issues.objects.filter(status=Issues.Status.OPEN)
    serializer = issuesSerializer(open_tickets, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET', 'PATCH'])
def ticket_detail(request, ticket_id):
    try:
        ticket = Issues.objects.get(id=ticket_id)
    except Issues.DoesNotExist:
        return Response({"error": "Ticket not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = issuesSerializer(ticket)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'PATCH':
        serializer = issuesSerializer(ticket, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    serializer = issuesSerializer(ticket)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
def create_ticket(request):
    serializer = issuesSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#####################
#                   #
#    priorities     #
#                   #
#####################


@api_view(['GET'])
def get_all_priorities(request):
    priorities = Priority.objects.all()
    serializer = prioritySerializer(priorities,many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_single_priority(request,id):
    try:
        priority = Priority.objects.get(id=id)
    except Exception as e:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = prioritySerializer(priority,many=False)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
def add_priority(request):
    input = request.data
    serializer = prioritySerializer(data=input)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['PATCH'])
def update_priority(request,id):
    input = request.data
    try:
        priority = Priority.objects.get(id=id)
    except Exception as e:
        return Response({"id":-1,"title":"not found"},status=status.HTTP_404_NOT_FOUND)
    
    serializer = prioritySerializer(priority,data=input)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
    else:
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


######################
#                    #
#    Departments     #
#                    #
######################


"""
GET - get data
POST - create new data
PATCH - partial update 
"""

@api_view(['GET'])
def get_all_departments(request):
    # THIS FUNCTION GETS ALL DEPARTMENTS FROM THE DATABASE
    departments = Departments.objects.all()
    serializer = departmentSerializer(departments, many=True)
    # CONVERT DATA TO JSON (MANY=True BECAUSE THERE ARE MULTIPLE OBJECTS)

    return Response(serializer.data, status=status.HTTP_200_OK)
    # RETURN THE DATA WITH STATUS 200 (SUCCESS)

@api_view(['GET'])
def get_department(request, pk):
    # THIS FUNCTION GETS ONE DEPARTMENT BY ID (PRIMARY KEY)
    department = get_object_or_404(Departments, pk=pk)
    # IF THE DEPARTMENT DOES NOT EXIST - RETURN 404 AUTOMATICALLY
    serializer = departmentSerializer(department)
    # CONVERT OBJECT TO JSON

    return Response(serializer.data, status=status.HTTP_200_OK)
    # RETURN THE DATA WITH STATUS 200

@api_view(['POST'])
def add_department(request):
    # THIS FUNCTION CREATES A NEW DEPARTMENT

    # GET DATA FROM REQUEST (FROM FRONTEND)
    serializer = departmentSerializer(data=request.data)

    # CHECK IF DATA IS VALID
    if serializer.is_valid():
        serializer.save()

        # RETURN CREATED OBJECT WITH STATUS 201
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # IF DATA IS NOT VALID - RETURN ERRORS
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH'])
def update_department(request, pk):
    # THIS FUNCTION UPDATES AN EXISTING DEPARTMENT
    department = get_object_or_404(Departments, pk=pk)
    # GET THE DEPARTMENT OR RETURN 404
    serializer = departmentSerializer(department, data=request.data, partial=True)
    # UPDATE ONLY FIELDS THAT WERE SENT (PARTIAL UPDATE)

    # CHECK IF DATA IS VALID
    if serializer.is_valid():
        serializer.save()

        # RETURN UPDATED OBJECT WITH STATUS 200
        return Response(serializer.data, status=status.HTTP_200_OK)

    # RETURN ERRORS IF DATA IS NOT VALID
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)