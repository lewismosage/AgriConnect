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
from .models import FarmerProfile
from .serializers import FarmerProfileSerializer
from rest_framework.parsers import MultiPartParser, FormParser


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

            # Include farmer_profile data with full image URL if the user is a farmer
            farmer_profile_data = None
            if user.user_type == 'farmer' and hasattr(user, 'farmer_profile'):
                farmer_profile = user.farmer_profile
                farmer_profile_data = {
                    'farm_name': farmer_profile.farm_name,
                    'location': farmer_profile.location,
                    'specialty': farmer_profile.specialty,
                    'description': farmer_profile.description,
                    'farm_image': (
                        f"{request.scheme}://{request.get_host()}{farmer_profile.farm_image.url}" 
                        if farmer_profile.farm_image else None
                    )
                }

            # Prepare the response data
            response_data = {
                'user': serializer.data,
                'farmer_profile': farmer_profile_data,
                'user_type': user.user_type,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }

            return Response(response_data, status=status.HTTP_200_OK)
        else:
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
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        # Manually parse the nested user and farmer_profile data
        user_data = {
            'email': request.data.get('user[email]'),
            'password': request.data.get('user[password]'),
            'first_name': request.data.get('user[first_name]'),
            'last_name': request.data.get('user[last_name]'),
            'phone_number': request.data.get('user[phone_number]'),
            'user_type': request.data.get('user[user_type]'),
        }

        farmer_profile_data = {
            'farm_name': request.data.get('farmer_profile[farm_name]'),
            'location': request.data.get('farmer_profile[location]'),
            'specialty': request.data.get('farmer_profile[specialty]'),
            'description': request.data.get('farmer_profile[description]'),
            'farm_image': request.FILES.get('farmer_profile[farm_image]'),
        }

        # Combine the data into the expected format
        data = {
            'user': user_data,
            'farmer_profile': farmer_profile_data,
        }

        # Pass the parsed data to the serializer
        serializer = FarmerRegistrationSerializer(data=data)
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
            logger.error(f"Validation errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class FarmerProfileUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        try:
            farmer_profile = request.user.farmer_profile
        except FarmerProfile.DoesNotExist:
            return Response(
                {'detail': 'Farmer profile not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Update the farmer profile
        serializer = FarmerProfileSerializer(
            farmer_profile,
            data=request.data,
            partial=True  # Allow partial updates for PATCH
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            # Log validation errors
            print("Validation errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class FarmImageUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Ensure the user is a farmer
        if request.user.user_type != 'farmer':
            return Response(
                {'detail': 'Only farmers can upload farm images.'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Get the uploaded file
        file = request.FILES.get('file')
        if not file:
            return Response(
                {'detail': 'No file uploaded.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Save the file to the farmer's profile
        try:
            farmer_profile = request.user.farmer_profile
            farmer_profile.farm_image = file
            farmer_profile.save()
            return Response(
                {'url': farmer_profile.farm_image.url},  # Return the URL of the uploaded image
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {'detail': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )