# notifications/views.py
from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import Notification
from .serializers import NotificationSerializer

class CreateNotificationView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = NotificationSerializer

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

