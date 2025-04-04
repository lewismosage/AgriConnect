# subscriptions/views.py
from rest_framework import generics, status, permissions, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from datetime import timedelta
from .models import Subscription, Payment
from .serializers import (
    SubscriptionSerializer,
    CreateSubscriptionSerializer,
    UpdateSubscriptionSerializer,
    PaymentRequestSerializer,
    PaymentSerializer
)
from django.shortcuts import get_object_or_404

class SubscriptionView(generics.RetrieveAPIView):
    serializer_class = SubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return get_object_or_404(Subscription, user=self.request.user)

class CreateSubscriptionView(generics.CreateAPIView):
    serializer_class = CreateSubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        if hasattr(user, 'subscription'):
            raise serializers.ValidationError({"detail": "User already has a subscription"})
            
        plan = serializer.validated_data.get('plan', 'free_trial')
        
        # Default values
        subscription_data = {
            'user': user,
            'status': 'trial' if plan == 'free_trial' else 'active',
            'is_active': True,
        }
        
        # For free trial, set end_date to 30 days from now
        if plan == 'free_trial':
            subscription_data['end_date'] = timezone.now() + timedelta(days=30)
        
        subscription = serializer.save(**subscription_data)
        
        return subscription

class UpdateSubscriptionView(generics.UpdateAPIView):
    serializer_class = UpdateSubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return get_object_or_404(Subscription, user=self.request.user)

    def perform_update(self, serializer):
        instance = self.get_object()
        
        # If upgrading from trial to premium, set the next billing date
        if instance.status == 'trial' and serializer.validated_data.get('plan') == 'premium':
            serializer.save(status='active', next_billing_date=timezone.now() + timedelta(days=30))
        else:
            serializer.save()

class PaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        # Get or create subscription
        try:
            subscription = Subscription.objects.get(user=request.user)
        except Subscription.DoesNotExist:
            # Create a basic subscription if none exists
            subscription = Subscription.objects.create(
                user=request.user,
                plan='basic',  # Default plan
                status='active',
                is_active=True,
                end_date=timezone.now() + timedelta(days=365),  # 1 year
                next_billing_date=timezone.now() + timedelta(days=30)
            )

        serializer = PaymentRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        data = serializer.validated_data
        
        try:
            # Create payment record
            payment = Payment.objects.create(
                subscription=subscription,
                amount=data['amount'],
                payment_method=data['payment_method'],
                transaction_id=f"txn_{timezone.now().timestamp()}",
                status='completed',
                description=f"Payment for {data['plan']} plan subscription"
            )
            
            # Update subscription with new plan details
            subscription.plan = data['plan']
            subscription.status = 'active'
            subscription.next_billing_date = timezone.now() + timedelta(days=30)
            subscription.payment_method = data['payment_method']
            
            if data['payment_method'] == 'mpesa' and data.get('mpesa_number'):
                subscription.mpesa_number = data['mpesa_number']
            
            subscription.save()
            
            return Response(
                PaymentSerializer(payment).data,
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response(
                {'detail': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class CheckSubscriptionAccess(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not hasattr(request.user, 'farmer_profile'):
            return Response({
                'has_access': True,
                'message': 'Consumers do not require subscription',
                'requires_subscription': False
            })
            
        try:
            subscription = Subscription.objects.get(user=request.user)
            has_access = subscription.can_access_service
            serializer = SubscriptionSerializer(subscription)
            
            response_data = {
                'has_access': has_access,
                'subscription': serializer.data
            }
            
            if not has_access:
                response_data['message'] = (
                    'Your subscription has expired' if subscription.status == 'expired' 
                    else 'Subscription requires payment'
                )
                return Response(response_data, status=status.HTTP_402_PAYMENT_REQUIRED)
            
            return Response(response_data)
            
        except Subscription.DoesNotExist:
            return Response({
                'has_access': False,
                'message': 'No subscription found',
                'requires_subscription': True,
                'subscription': None
            }, status=status.HTTP_402_PAYMENT_REQUIRED)
        
# Add these to your existing views
class PaymentHistoryView(generics.ListAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Payment.objects.filter(
            subscription__user=self.request.user
        ).order_by('-payment_date')

class CancelSubscriptionView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        subscription = get_object_or_404(
            Subscription, 
            user=request.user,
            status='active'
        )
        
        # In a real implementation, you might want to cancel with payment provider
        subscription.status = 'canceled'
        subscription.is_active = False
        subscription.save()
        
        return Response(
            {'detail': 'Subscription canceled. It will remain active until the end of the current billing period.'},
            status=status.HTTP_200_OK
        )

class SubscriptionPlansView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        plans = [
            {
                'id': 'free_trial',
                'name': 'Free Trial',
                'price': 0,
                'features': [
                    '30-day free access',
                    'Basic features',
                    'Limited product listings'
                ]
            },
            {
                'id': 'basic',
                'name': 'Basic Plan',
                'price': 9.99,
                'features': [
                    'Up to 20 product listings',
                    'Basic analytics',
                    'Email support'
                ]
            },
            {
                'id': 'premium',
                'name': 'Premium Plan',
                'price': 19.99,
                'features': [
                    'Unlimited product listings',
                    'Advanced analytics',
                    'Priority support',
                    'Marketing tools'
                ]
            }
        ]
        return Response(plans)