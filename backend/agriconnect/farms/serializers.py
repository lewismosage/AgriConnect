from rest_framework import serializers
from .models import Farm
from accounts.models import FarmerProfile

class FarmSerializer(serializers.ModelSerializer):
    rating = serializers.SerializerMethodField()
    farm_image = serializers.SerializerMethodField()

    class Meta:
        model = Farm
        fields = [
            'id', 'name', 'location', 'description', 'image', 
            'farmer', 'specialty', 'farm_image', 'rating',
            'about', 'sustainability'
        ]

    def get_rating(self, obj):
        return obj.rating if hasattr(obj, 'rating') else 0

    def get_farm_image(self, obj):
        farmer_profile = obj.farmer.farmer_profile if hasattr(obj.farmer, 'farmer_profile') else None
        if farmer_profile and farmer_profile.farm_image:
            return self.context['request'].build_absolute_uri(farmer_profile.farm_image.url)
        return None