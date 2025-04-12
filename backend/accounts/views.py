from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from .models import User, ShippingAddress, PaymentMethod
from .serializers import UserSerializer, FarmerRegistrationSerializer, FarmerProfileSerializer, ShippingAddressSerializer, PaymentMethodSerializer
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
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
import requests

import jwt
from django.conf import settings
from rest_framework.exceptions import AuthenticationFailed

from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.microsoft.views import MicrosoftGraphOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from allauth.socialaccount.models import SocialAccount



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
                    'farm_image': farmer_profile.farm_image.url if farmer_profile.farm_image else None
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
        
class GoogleLogin(APIView):
    def post(self, request):
        token = request.data.get('token')
        
        try:
            # Verify the token with Google
            response = requests.get(
                'https://www.googleapis.com/oauth2/v3/tokeninfo',
                params={'id_token': token}
            )
            response.raise_for_status()
            idinfo = response.json()
            
            # Check audience
            if idinfo['aud'] != settings.SOCIALACCOUNT_PROVIDERS['google']['APP']['client_id']:
                raise AuthenticationFailed('Invalid audience')
            
            # Check if email is verified
            if not idinfo.get('email_verified', False):
                raise AuthenticationFailed('Google email not verified')
            
            email = idinfo['email']
            first_name = idinfo.get('given_name', '')
            last_name = idinfo.get('family_name', '')
            
            # Try to get existing user
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                # Create new user
                username = email.split('@')[0]
                counter = 1
                while User.objects.filter(username=username).exists():
                    username = f"{email.split('@')[0]}_{counter}"
                    counter += 1
                
                user = User.objects.create_user(
                    email=email,
                    username=username,
                    first_name=first_name,
                    last_name=last_name,
                    user_type='consumer'  # Default to consumer
                )
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            serializer = UserSerializer(user)
            
            return Response({
                'user': serializer.data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
            
        except requests.exceptions.RequestException as e:
            raise AuthenticationFailed(f'Google token verification failed: {str(e)}')
        except Exception as e:
            raise AuthenticationFailed(str(e))

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
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def patch(self, request):
        if request.user.user_type != 'farmer':
            return Response(
                {'detail': 'Only farmers can update farm profiles.'},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            farmer_profile = request.user.farmer_profile
            farm = farmer_profile.farm
        except (FarmerProfile.DoesNotExist, AttributeError):
            return Response(
                {'detail': 'Farmer profile not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Get data from request based on content type
        if request.content_type == 'application/json':
            request_data = request.data
        else:
            request_data = request.data.dict()  # Convert QueryDict to regular dict

        # List of fields that should update both profile and farm
        shared_fields = ['farm_name', 'location', 'specialty', 'description', 'about', 'sustainability']
        
        profile_updates = {}
        farm_updates = {}

        for field in shared_fields:
            if field in request_data:
                profile_updates[field] = request_data[field]
                if farm:  # Only try to update farm if it exists
                    farm_updates[field] = request_data[field]

        # Handle file upload separately
        if 'farm_image' in request_data:
            profile_updates['farm_image'] = request_data['farm_image']

        # Update the farm model if there are changes
        if farm and farm_updates:
            for field, value in farm_updates.items():
                setattr(farm, field, value)
            farm.save()

        # Update the farmer profile
        serializer = FarmerProfileSerializer(
            farmer_profile,
            data=profile_updates,
            partial=True,
            context={'request': request}
        )

        if serializer.is_valid():
            serializer.save()
            
            # Return complete updated profile data
            return Response({
                'farmer_profile': FarmerProfileSerializer(
                    farmer_profile, 
                    context={'request': request}
                ).data,
                'detail': 'Profile updated successfully'
            }, status=status.HTTP_200_OK)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class FarmImageUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.user_type != 'farmer':
            return Response(
                {'detail': 'Only farmers can upload farm images.'},
                status=status.HTTP_403_FORBIDDEN
            )

        file = request.FILES.get('file')
        if not file:
            return Response(
                {'detail': 'No file uploaded.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            farmer_profile = request.user.farmer_profile
            farmer_profile.farm_image = file
            farmer_profile.save()
            
            # Return the Cloudinary URL directly
            return Response(
                {'url': farmer_profile.farm_image.url},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {'detail': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ShippingAddressViewSet(viewsets.ModelViewSet):
    serializer_class = ShippingAddressSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get_queryset(self):
        return ShippingAddress.objects.filter(user=self.request.user).order_by('-is_default', '-created_at')

    def perform_create(self, serializer):
        if serializer.validated_data.get('is_default', False):
            ShippingAddress.objects.filter(user=self.request.user, is_default=True).update(is_default=False)
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        if serializer.validated_data.get('is_default', False):
            ShippingAddress.objects.filter(user=self.request.user, is_default=True).update(is_default=False)
        serializer.save()

class PaymentMethodViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentMethodSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get_queryset(self):
        return PaymentMethod.objects.filter(user=self.request.user).order_by('-is_default', '-created_at')

    def perform_create(self, serializer):
        card_number = self.request.data.get('card_number', '')
        last_four = card_number[-4:] if len(card_number) >= 4 else ''

        if serializer.validated_data.get('is_default', False):
            PaymentMethod.objects.filter(user=self.request.user, is_default=True).update(is_default=False)
        serializer.save(user=self.request.user, last_four=last_four)

    def perform_update(self, serializer):
        if serializer.validated_data.get('is_default', False):
            PaymentMethod.objects.filter(user=self.request.user, is_default=True).update(is_default=False)
        serializer.save()

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')
        
        # Check if current password is correct
        user = request.user
        if not user.check_password(current_password):
            return Response(
                {'detail': 'Current password is incorrect.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Set new password
        user.set_password(new_password)
        user.save()
        
        # Return success response
        return Response(
            {'detail': 'Password changed successfully.'},
            status=status.HTTP_200_OK
        )