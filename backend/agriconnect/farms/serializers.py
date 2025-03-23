from rest_framework import serializers
from .models import Farm
from accounts.models import FarmerProfile

class FarmSerializer(serializers.ModelSerializer):
    farm_image = serializers.SerializerMethodField()

    class Meta:
        model = Farm
        fields = ['id', 'name', 'location', 'description', 'image', 'farmer', 'specialty', 'farm_image']

    def get_farm_image(self, obj):
        # Get the related FarmerProfile for this farm
        farmer_profile = FarmerProfile.objects.filter(farm=obj).first()
        if farmer_profile and farmer_profile.farm_image:
            return self.context['request'].build_absolute_uri(farmer_profile.farm_image.url)
        return None