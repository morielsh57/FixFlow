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

