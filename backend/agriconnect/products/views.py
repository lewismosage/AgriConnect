# products/views.py
from rest_framework import generics, permissions
from .models import Product
from .serializers import ProductSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.exceptions import PermissionDenied

class ProductListCreateView(generics.ListCreateAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        # Only return products for the logged-in farmer's farm
        if hasattr(self.request.user, 'farmer_profile') and hasattr(self.request.user.farmer_profile, 'farm'):
            return Product.objects.filter(farm=self.request.user.farmer_profile.farm)
        return Product.objects.none()

    def perform_create(self, serializer):
        # Automatically associate the product with the farm of the logged-in farmer
        if hasattr(self.request.user, 'farmer_profile') and hasattr(self.request.user.farmer_profile, 'farm'):
            farm = self.request.user.farmer_profile.farm
            serializer.save(farm=farm)
        else:
            raise PermissionDenied("You must be a farmer with a farm to create products")

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only allow access to products for the logged-in farmer's farm
        farm = self.request.user.farmer_profile.farm
        return Product.objects.filter(farm=farm)