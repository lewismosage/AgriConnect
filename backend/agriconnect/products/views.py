from rest_framework import generics, permissions
from .models import Product
from .serializers import ProductSerializer
from rest_framework.response import Response
from rest_framework import status

class ProductListCreateView(generics.ListCreateAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only return products for the logged-in farmer's farm
        farm = self.request.user.farmer_profile.farm
        return Product.objects.filter(farm=farm)

    def perform_create(self, serializer):
        # Automatically associate the product with the farm of the logged-in farmer
        farm = self.request.user.farmer_profile.farm
        serializer.save(farm=farm)

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only allow access to products for the logged-in farmer's farm
        farm = self.request.user.farmer_profile.farm
        return Product.objects.filter(farm=farm)