from rest_framework_simplejwt.views import TokenObtainPairView
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('all-issues/', views.tickets),
]