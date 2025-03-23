# products/views.py
from rest_framework import generics, permissions
from .models import Product
from .serializers import ProductSerializer

class ProductListCreateView(generics.ListCreateAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        # Check if a specific farm is requested
        farm_id = self.request.query_params.get('farm', None)
        if farm_id:
            return Product.objects.filter(farm=farm_id)
        # If no farm is specified, return all products
        return Product.objects.all()

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