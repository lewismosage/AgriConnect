from rest_framework import generics, permissions
from .models import Farm
from .serializers import FarmSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from products.models import Product
from products.serializers import ProductSerializer
from rest_framework import status

class MyFarmView(APIView):
    def get(self, request):
        try:
            farmer_profile = request.user.farmer_profile
            farm = farmer_profile.farm  # Access the farm through the FarmerProfile
            if farm:
                return Response({
                    'id': farm.id,
                    'name': farm.name,
                    'location': farm.location,
                    'description': farm.description,
                    'image': farm.image.url if farm.image else None,
                })
            else:
                return Response({'detail': 'No farm associated with this user.'}, status=status.HTTP_404_NOT_FOUND)
        except AttributeError:
            return Response({'detail': 'User does not have a farmer profile.'}, status=status.HTTP_404_NOT_FOUND)
        
class FarmList(generics.ListCreateAPIView):
    queryset = Farm.objects.all()
    serializer_class = FarmSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class FarmDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Farm.objects.all()
    serializer_class = FarmSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class FarmCreateView(generics.CreateAPIView):
    serializer_class = FarmSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(farmer=self.request.user)

class FarmProductsView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        farm_id = self.kwargs['pk']  # Get the farm ID from the URL
        return Product.objects.filter(farm_id=farm_id)
