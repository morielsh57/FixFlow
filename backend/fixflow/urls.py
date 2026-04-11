from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),
    path('add-user/', views.create_user),
    path('users/', views.get_all_users),
    path('users/<int:id>/', views.get_user),
    path('change-password/', views.change_password),
    path('login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    # Issues
    path('all-issues/', views.tickets),
    path('issue/<int:ticket_id>/', views.ticket_detail),
    path('issues-new/', views.create_ticket),
    # Departments
    path('departments/', views.get_all_departments),  # GET ALL
    path('departments/<int:pk>/', views.get_department),  # GET ONE
    path('departments/add/', views.add_department),  # ADD
    path('departments/update/<int:pk>/', views.update_department),  # UPDATE
    # Priority
    path('priority/', views.get_all_priorities),
    path('priority/<int:id>/', views.get_single_priority),
    path('priority/update/<int:id>/', views.update_priority),
    path('priority/add/', views.add_priority),
]