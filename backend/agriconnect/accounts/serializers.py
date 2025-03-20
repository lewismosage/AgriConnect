# accounts/serializers.py
from rest_framework import serializers
from .models import User, FarmerProfile

class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    farmer_profile = serializers.SerializerMethodField()  # Add farmer_profile field

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name', 'full_name', 'phone_number', 'profile_picture', 'user_type', 'farmer_profile']
        extra_kwargs = {
            'password': {'write_only': True},
            'username': {'required': False},  # Make username optional
        }

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"  # Combine first_name and last_name

    def get_farmer_profile(self, obj):
        # If the user is a farmer and has a farmer_profile, serialize it
        if obj.user_type == 'farmer' and hasattr(obj, 'farmer_profile'):
            return FarmerProfileSerializer(obj.farmer_profile).data
        return None

    def create(self, validated_data):
        # Generate a username if not provided
        if 'username' not in validated_data:
            validated_data['username'] = validated_data.get('email')
        user = User.objects.create_user(**validated_data)
        return user

class FarmerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = FarmerProfile
        fields = ['farm_name', 'location', 'specialty', 'description', 'farm_image']

class FarmerRegistrationSerializer(serializers.Serializer):
    user = UserSerializer()
    farmer_profile = FarmerProfileSerializer()

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        farmer_profile_data = validated_data.pop('farmer_profile')

        # Ensure username is set to email if not provided
        if 'username' not in user_data:
            user_data['username'] = user_data.get('email')

        # Create the user
        user = User.objects.create_user(**user_data)

        # Create the farmer profile
        farmer_profile = FarmerProfile.objects.create(user=user, **farmer_profile_data)

        return {
            'user': user,
            'farmer_profile': farmer_profile,
        }