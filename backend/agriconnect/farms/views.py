from rest_framework import generics, permissions
from rest_framework.permissions import IsAuthenticated
from .models import Farm
from .serializers import FarmSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from products.models import Product
from products.serializers import ProductSerializer
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.contrib.sessions.models import Session
from django.utils import timezone
from rest_framework.permissions import AllowAny

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
                    'about': farm.about,
                    'sustainability': farm.sustainability,
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
        rating = request.data.get('rating')

        # Validate rating
        if not (0 <= rating <= 5):
            return Response(
                {'error': 'Rating must be between 1 and 5'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get user identifier
        if request.user.is_authenticated:
            user_identifier = f"user_{request.user.id}"
        else:
            if not request.session.session_key:
                request.session.create()
            user_identifier = f"anon_{request.session.session_key}"

        # Initialize ratings if None
        if farm.ratings is None:
            farm.ratings = []

        # Find existing rating
        existing_rating_index = next(
            (i for i, r in enumerate(farm.ratings) 
             if isinstance(r, dict) and r.get('user_identifier') == user_identifier),
            None
        )

        # Handle rating submission/removal
        if existing_rating_index is not None:
            # User already rated - remove their rating
            removed_rating = farm.ratings.pop(existing_rating_index)
            action = 'removed'
        elif rating > 0:
            # New rating - add it
            farm.ratings.append({
                'user_identifier': user_identifier,
                'rating': rating,
                'timestamp': timezone.now().isoformat()
            })
            action = 'added'

        # Recalculate average
        if farm.ratings:
            valid_ratings = [r['rating'] for r in farm.ratings if isinstance(r, dict) and r.get('rating', 0) > 0]
            farm.rating = sum(valid_ratings) / len(valid_ratings) if valid_ratings else 0
            total_ratings = len(valid_ratings)
        else:
            farm.rating = 0
            total_ratings = 0

        farm.save()

        return Response({
            'rating': farm.rating,
            'total_ratings': total_ratings,
            'action': action
        }, status=status.HTTP_200_OK)

class UserRatingView(APIView):
    def get(self, request, farm_id):
        farm = get_object_or_404(Farm, id=farm_id)
        
        if request.user.is_authenticated:
            user_identifier = f"user_{request.user.id}"
        else:
            if not request.session.session_key:
                return Response({'userRating': None})
            user_identifier = f"anon_{request.session.session_key}"

        user_rating = next(
            (r for r in farm.ratings 
             if r['user_identifier'] == user_identifier),
            None
        )
        
        return Response({
            'userRating': user_rating['rating'] if user_rating else None
        }, status=status.HTTP_200_OK)

class GetRatingView(APIView):
    def get(self, request, farm_id):
        farm = get_object_or_404(Farm, id=farm_id)
        return Response({'rating': farm.rating, 'total_ratings': len(farm.ratings)}, status=status.HTTP_200_OK)
    
class RatingInfoView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, farm_id):
        farm = get_object_or_404(Farm, id=farm_id)
        user_rating = None
        
        if request.user.is_authenticated:
            user_rating = next(
                (r['rating'] for r in farm.ratings if r.get('user_id') == request.user.id),
                None
            )
        
        return Response({
            'averageRating': farm.rating,
            'totalRatings': len(farm.ratings),
            'userRating': user_rating
        })

class RateView(APIView):
    
    
    def post(self, request, farm_id):
        farm = get_object_or_404(Farm, id=farm_id)
        rating = request.data.get('rating')
        
        if not (0 <= rating <= 5):
            return Response(
                {'error': 'Rating must be between 1 and 5'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Find existing user rating
        user_rating_index = next(
            (i for i, r in enumerate(farm.ratings) if r.get('user_id') == request.user.id),
            None
        )
        
        if rating == 0:  # Remove rating
            if user_rating_index is not None:
                farm.ratings.pop(user_rating_index)
        else:  # Add/update rating
            rating_data = {
                'user_id': request.user.id,
                'rating': rating
            }
            
            if user_rating_index is not None:
                farm.ratings[user_rating_index] = rating_data
            else:
                farm.ratings.append(rating_data)
        
        # Recalculate average
        if farm.ratings:
            farm.rating = sum(r['rating'] for r in farm.ratings) / len(farm.ratings)
        else:
            farm.rating = 0
        
        farm.save()
        
        return Response({
            'averageRating': farm.rating,
            'totalRatings': len(farm.ratings)
        })