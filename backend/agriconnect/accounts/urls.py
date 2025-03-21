from django.urls import path
from .views import UserList, UserDetail, FarmerRegistrationView, RegisterView, LoginView, LogoutView, UserDetailView, FarmImageUploadView, FarmerProfileUpdateView

urlpatterns = [
    path('users/', UserList.as_view()),
    path('users/<int:pk>/', UserDetail.as_view()),
    path('user/', UserDetailView.as_view(), name='user-detail'),
    path('register/', RegisterView.as_view(), name='register'),  
    path('register/farmer/', FarmerRegistrationView.as_view(), name='farmer-register'),  
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('farmer/profile/update/', FarmerProfileUpdateView.as_view(), name='farmer-profile-update'),
    path('upload-farm-image/', FarmImageUploadView.as_view(), name='upload-farm-image'),
]