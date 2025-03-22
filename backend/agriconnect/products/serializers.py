from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'category', 'quantity', 'unit', 'price', 'image']
        read_only_fields = ['id']

    def create(self, validated_data):
        # Automatically associate the product with the farm of the logged-in farmer
        farm = self.context['request'].user.farmer_profile.farm
        validated_data['farm'] = farm
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Ensure the farm remains the same when updating
        validated_data['farm'] = instance.farm
        return super().update(instance, validated_data)