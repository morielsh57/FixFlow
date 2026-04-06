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


"""
@api_view(['GET','POST','PATCH'])   # MUST - PICK ONE / MORE
def FUNC_NAME(request):             # MUST - PICK FUNC NAME
    pass                            #

"""

# ======================
# 4 DEPARTMENTS FUNCTIONS
# ======================

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