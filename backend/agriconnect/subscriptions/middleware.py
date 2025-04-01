# subscriptions/middleware.py
from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin
from django.urls import resolve
from .models import Subscription
from rest_framework import status
import re

class SubscriptionMiddleware(MiddlewareMixin):
    """
    Middleware to check if farmer users have an active subscription
    """
    EXEMPT_URLS = [
        '/api/auth/',
        '/api/subscriptions/',
        '/admin/',
        '/api/payments/',
    ]
    
    def process_request(self, request):
        # Skip middleware for exempt URLs
        for url in self.EXEMPT_URLS:
            if re.match(url, request.path):
                return None
        
        # Skip for non-authenticated users
        if not hasattr(request, 'user') or not request.user.is_authenticated:
            return None
        
        # Skip for non-farmer users
        if not hasattr(request.user, 'farmer_profile'):
            return None
        
        try:
            subscription = Subscription.objects.get(user=request.user)
            if not subscription.can_access_service:
                return JsonResponse(
                    {
                        'detail': 'Your subscription has expired. Please renew to continue using the service.',
                        'subscription_status': subscription.status,
                        'days_remaining': max(0, (subscription.end_date - timezone.now()).days)
                            if subscription.status == 'trial' else 0
                    },
                    status=status.HTTP_402_PAYMENT_REQUIRED
                )
        except Subscription.DoesNotExist:
            return JsonResponse(
                {
                    'detail': 'You need to subscribe to access this service'
                },
                status=status.HTTP_402_PAYMENT_REQUIRED
            )
        
        return None