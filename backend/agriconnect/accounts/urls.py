from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserList, UserDetail, FarmerRegistrationView, RegisterView, LoginView, LogoutView,UserDetailView, FarmImageUploadView, FarmerProfileUpdateView, ShippingAddressViewSet, PaymentMethodViewSet, ChangePasswordView, GoogleLogin

router = DefaultRouter()
router.register(r'shipping-addresses', ShippingAddressViewSet, basename='shipping-address')
router.register(r'payment-methods', PaymentMethodViewSet, basename='payment-method')

urlpatterns = [
    path('', include(router.urls)),
    path('users/', UserList.as_view()),
    path('users/<int:pk>/', UserDetail.as_view()),
    path('user/', UserDetailView.as_view(), name='user-detail'),
    path('register/', RegisterView.as_view(), name='register'),  
    path('register/farmer/', FarmerRegistrationView.as_view(), name='farmer-register'),  
    path('login/', LoginView.as_view(), name='login'),
    path('google-login/', GoogleLogin.as_view(), name='google-login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('farmer/profile/update/', FarmerProfileUpdateView.as_view(), name='farmer-profile-update'),
    path('upload-farm-image/', FarmImageUploadView.as_view(), name='upload-farm-image'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
]