from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer, FarmerRegistrationSerializer
from rest_framework.views import APIView
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
import logging
from .serializers import UserSerializer, FarmerRegistrationSerializer, FarmerProfileSerializer
from rest_framework.permissions import IsAuthenticated


logger = logging.getLogger(__name__)
User = get_user_model()

class RegisterView(APIView):
    def post(self, request):
        user_type = request.data.get('user_type', 'consumer')
        if user_type == 'farmer':
            serializer = FarmerRegistrationSerializer(data=request.data)
        else:
            serializer = UserSerializer(data=request.data)

        if serializer.is_valid():
            if user_type == 'farmer':
                data = serializer.save()
                user = data['user']
            else:
                user = serializer.save()

            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        else:
            logger.error(f"Validation errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        # Use the custom backend to authenticate
        user = authenticate(request, email=email, password=password)
        
        if user:
            refresh = RefreshToken.for_user(user)
            serializer = UserSerializer(user)  # Use UserSerializer to serialize the user
            return Response({
                'user': serializer.data,  # Include serialized user data
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_200_OK)
        else:
            # Debugging: Print authentication failure
            print("Authentication failed")
            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)

class FarmerRegistrationView(APIView):
    def post(self, request):
        serializer = FarmerRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.save()
            refresh = RefreshToken.for_user(data['user'])
            return Response({
                'user': UserSerializer(data['user']).data,
                'farmer_profile': FarmerProfileSerializer(data['farmer_profile']).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        else:
            logger.error(f"Validation errors: {serializer.errors}")  # Log validation errors
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)