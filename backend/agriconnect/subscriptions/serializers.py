# subscriptions/serializers.py
from rest_framework import serializers
from .models import Subscription, Payment
from datetime import datetime, timedelta
from django.utils import timezone

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            'id', 'amount', 'payment_method', 
            'transaction_id', 'status', 'payment_date',
            'description'
        ]
        read_only_fields = ['id', 'payment_date']

class SubscriptionSerializer(serializers.ModelSerializer):
    payments = PaymentSerializer(many=True, read_only=True)
    is_active = serializers.SerializerMethodField()
    days_remaining = serializers.SerializerMethodField()

    class Meta:
        model = Subscription
        fields = [
            'id', 'plan', 'status', 'start_date', 'end_date',
            'next_billing_date', 'is_active', 'payment_method',
            'mpesa_number', 'card_last_four', 'card_brand',
            'payments', 'days_remaining'
        ]
        read_only_fields = [
            'id', 'start_date', 'end_date', 'next_billing_date',
            'is_active', 'payments', 'days_remaining'
        ]

    def get_is_active(self, obj):
        return obj.can_access_service

    def get_days_remaining(self, obj):
        if obj.status == 'trial':
            delta = obj.end_date - timezone.now()
            return max(0, delta.days)
        elif obj.status == 'active' and obj.next_billing_date:
            delta = obj.next_billing_date - timezone.now()
            return max(0, delta.days)
        return 0

class CreateSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ['plan']
        read_only_fields = ['status', 'start_date', 'end_date']

    def create(self, validated_data):
        user = self.context['request'].user
        if hasattr(user, 'subscription'):
            raise serializers.ValidationError("User already has a subscription")
        
        # Create a free trial subscription by default
        subscription = Subscription.objects.create(
            user=user,
            plan=validated_data.get('plan', 'free_trial'),
            status='trial',
            end_date=timezone.now() + timedelta(days=30)
        )
        return subscription

class UpdateSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ['plan', 'payment_method', 'mpesa_number']
        extra_kwargs = {
            'plan': {'required': False},
            'payment_method': {'required': False},
            'mpesa_number': {'required': False},
        }

    def validate(self, data):
        # Validate payment method when upgrading from trial
        if 'plan' in data and data['plan'] != 'free_trial':
            if 'payment_method' not in data:
                raise serializers.ValidationError(
                    "Payment method is required when upgrading from free trial"
                )
        return data

class PaymentRequestSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, required=True)
    payment_method = serializers.ChoiceField(
        choices=[('mpesa', 'MPESA'), ('bank', 'Bank')],
        required=True
    )
    plan = serializers.CharField(required=True)
    mpesa_number = serializers.CharField(required=False, allow_blank=True)
    card_number = serializers.CharField(required=False, allow_blank=True)
    card_expiry = serializers.CharField(required=False, allow_blank=True)
    card_cvv = serializers.CharField(required=False, allow_blank=True)
    card_name = serializers.CharField(required=False, allow_blank=True)

    def validate(self, data):
        payment_method = data.get('payment_method')
        
        if payment_method == 'mpesa' and not data.get('mpesa_number'):
            raise serializers.ValidationError(
                {"mpesa_number": "MPESA number is required for MPESA payments"}
            )
            
        if payment_method == 'bank' and (
            not data.get('card_number') or 
            not data.get('card_expiry') or 
            not data.get('card_cvv') or 
            not data.get('card_name')
        ):
            raise serializers.ValidationError(
                {"card_details": "All card details are required for bank payments"}
            )
            
        return data