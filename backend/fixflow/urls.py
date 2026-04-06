from rest_framework_simplejwt.views import TokenObtainPairView
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('all-issues/', views.tickets),
    path('issue/<int:ticket_id>/', views.ticket_detail),
    path('issues-new/', views.create_ticket),

    # Departments
    path('departments/', views.get_all_departments),  # GET ALL
    path('departments/<int:pk>/', views.get_department),  # GET ONE
    path('departments/add/', views.add_department),  # ADD
    path('departments/update/<int:pk>/', views.update_department),  # UPDATE

]