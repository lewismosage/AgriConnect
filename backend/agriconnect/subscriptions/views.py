from rest_framework import generics, permissions
from .serializers import SubscriptionSerializer
from .models import Subscription
from datetime import datetime, timedelta

class SubscriptionCreateView(generics.CreateAPIView):
    serializer_class = SubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        end_date = datetime.now() + timedelta(days=30)  # 30-day free trial
        serializer.save(farmer=self.request.user, end_date=end_date)