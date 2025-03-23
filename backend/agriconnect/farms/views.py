from rest_framework import generics, permissions
from .models import Farm
from .serializers import FarmSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from products.models import Product
from products.serializers import ProductSerializer
from rest_framework import status
from django.shortcuts import get_object_or_404

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

    def get_serializer_context(self):
        # Pass the request context to the serializer
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
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
    
class SubmitRatingView(APIView):
    def post(self, request, farm_id):
        farm = get_object_or_404(Farm, id=farm_id)
        user = request.user
        rating = request.data.get('rating')

        if not (1 <= rating <= 5):
            return Response({'error': 'Rating must be between 1 and 5'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the user has already rated this farm
        user_rating = next((r for r in farm.ratings if r['user_id'] == user.id), None)

        if user_rating:
            # If the user has already rated, update their rating
            user_rating['rating'] = rating
        else:
            # If the user hasn't rated, add their rating
            farm.ratings.append({'user_id': user.id, 'rating': rating})

        # Recalculate the average rating
        total_ratings = sum(r['rating'] for r in farm.ratings)
        farm.rating = total_ratings / len(farm.ratings)
        farm.save()

        return Response({'rating': farm.rating, 'total_ratings': len(farm.ratings)}, status=status.HTTP_200_OK)

class GetRatingView(APIView):
    def get(self, request, farm_id):
        farm = get_object_or_404(Farm, id=farm_id)
        return Response({'rating': farm.rating, 'total_ratings': len(farm.ratings)}, status=status.HTTP_200_OK)