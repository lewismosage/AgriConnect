from rest_framework import serializers
from .models import User, FarmerProfile
from farms.models import Farm

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

    def create(self, validated_data):
        if 'username' not in validated_data:
            validated_data['username'] = validated_data.get('email')
        user = User.objects.create_user(**validated_data)
        return user

class FarmerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = FarmerProfile
        fields = ['location', 'specialty', 'description', 'farm_image']
        extra_kwargs = {
            'farm_image': {'required': False},
        }

class FarmerRegistrationSerializer(serializers.Serializer):
    user = UserSerializer()
    farmer_profile = FarmerProfileSerializer()
    farm = serializers.CharField(max_length=255)  # Add farm name field

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        farmer_profile_data = validated_data.pop('farmer_profile')
        farm_name = validated_data.pop('farm')

        if 'username' not in user_data:
            user_data['username'] = user_data.get('email')

        user = User.objects.create_user(**user_data)
        farmer_profile = FarmerProfile.objects.create(user=user, **farmer_profile_data)
        Farm.objects.create(name=farm_name, farmer=user, location=farmer_profile.location)

        return {
            'user': user,
            'farmer_profile': farmer_profile,
        }