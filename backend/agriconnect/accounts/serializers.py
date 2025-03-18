from rest_framework import serializers
from .models import User
from django.contrib.auth import get_user_model
from rest_framework.validators import UniqueValidator

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_farmer', 'is_consumer']

Farmer = get_user_model()

class FarmerRegistrationSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=Farmer.objects.all())]
    )
    password = serializers.CharField(write_only=True, required=True)
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Farmer
        fields = ('username', 'email', 'first_name', 'last_name', 'phone', 'password', 'confirm_password')

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        farmer = Farmer.objects.create_user(**validated_data)
        return farmer