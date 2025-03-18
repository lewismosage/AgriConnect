from django.urls import path
from .views import UserList, UserDetail, FarmerRegistrationView

urlpatterns = [
    path('users/', UserList.as_view()),
    path('users/<int:pk>/', UserDetail.as_view()),
    path('register/', FarmerRegistrationView.as_view(), name='farmer-registration'),
]