# accounts/urls.py
from django.urls import path
from .views import UserList, UserDetail, FarmerRegistrationView
from .views import RegisterView, LoginView, LogoutView

urlpatterns = [
    path('users/', UserList.as_view()),
    path('users/<int:pk>/', UserDetail.as_view()),
    path('register/', RegisterView.as_view(), name='register'),  
    path('register/farmer/', FarmerRegistrationView.as_view(), name='farmer-register'),  
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
]