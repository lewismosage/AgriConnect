# accounts/serializers.py
from rest_framework import serializers
from .models import User, FarmerProfile
from farms.models import Farm
from django.core.exceptions import ValidationError

class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    farmer_profile = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name', 'full_name', 'phone_number', 'profile_picture', 'user_type', 'farmer_profile']
        extra_kwargs = {
            'password': {'write_only': True},
            'username': {'required': False},
        }

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"

    def get_farmer_profile(self, obj):
        if obj.user_type == 'farmer' and hasattr(obj, 'farmer_profile'):
            return FarmerProfileSerializer(obj.farmer_profile).data
        return None

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        if 'username' not in validated_data:
            email = validated_data.get('email')
            username = email.split('@')[0]
            counter = 1
            while User.objects.filter(username=username).exists():
                username = f"{email.split('@')[0]}_{counter}"
                counter += 1
            validated_data['username'] = username
        user = User.objects.create_user(**validated_data)
        return user

class FarmerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = FarmerProfile
        fields = ['farm_name', 'location', 'specialty', 'description', 'farm_image', 'farm']
        extra_kwargs = {
            'farm_name': {'required': False},
            'farm_image': {'required': False},
            'farm': {'required': False},
        }

class FarmerRegistrationSerializer(serializers.Serializer):
    user = UserSerializer()
    farmer_profile = FarmerProfileSerializer()

    def validate(self, data):
        email = data['user'].get('email')
        if User.objects.filter(email=email).exists():
            raise ValidationError({"email": "A user with this email already exists."})
        return data

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        farmer_profile_data = validated_data.pop('farmer_profile')

        if 'username' not in user_data:
            email = user_data.get('email')
            username = email.split('@')[0]
            counter = 1
            while User.objects.filter(username=username).exists():
                username = f"{email.split('@')[0]}_{counter}"
                counter += 1
            user_data['username'] = username

        user = User.objects.create_user(**user_data)

        # Create the Farm instance
        farm = Farm.objects.create(
            name=farmer_profile_data.get('farm_name', 'Unnamed Farm'),
            location=farmer_profile_data.get('location'),
            description=farmer_profile_data.get('description'),
            farmer=user,
            specialty=farmer_profile_data.get('specialty'),
        )

        # Create the FarmerProfile and link it to the Farm
        farmer_profile = FarmerProfile.objects.create(
            user=user,
            farm=farm,  # Link the Farm instance
            **farmer_profile_data
        )

        return {
            'user': user,
            'farmer_profile': farmer_profile,
        }