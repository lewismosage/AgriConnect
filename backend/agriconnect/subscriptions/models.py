# subscriptions/models.py
from django.db import models
from django.conf import settings
from django.utils import timezone
from django.core.exceptions import ValidationError
from enum import Enum

class SubscriptionPlan(Enum):
    FREE_TRIAL = 'free_trial'
    PREMIUM = 'premium'
    ENTERPRISE = 'enterprise'

class SubscriptionStatus(Enum):
    ACTIVE = 'active'
    TRIAL = 'trial'
    EXPIRED = 'expired'
    CANCELED = 'canceled'
    PAYMENT_PENDING = 'payment_pending'

class Subscription(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='subscription'
    )
    plan = models.CharField(
        max_length=20,
        choices=[(tag.value, tag.name) for tag in SubscriptionPlan],
        default=SubscriptionPlan.FREE_TRIAL.value
    )
    status = models.CharField(
        max_length=20,
        choices=[(tag.value, tag.name) for tag in SubscriptionStatus],
        default=SubscriptionStatus.TRIAL.value
    )
    start_date = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField()
    next_billing_date = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    trial_ending_notification_sent = models.BooleanField(default=False)
    expired_notification_sent = models.BooleanField(default=False)
    
    # Payment information
    payment_method = models.CharField(
        max_length=50, 
        choices=[('mpesa', 'MPESA'), ('bank', 'Bank')],
        blank=True, null=True
    )
    mpesa_number = models.CharField(max_length=15, blank=True, null=True)
    card_last_four = models.CharField(max_length=4, blank=True, null=True)
    card_brand = models.CharField(max_length=50, blank=True, null=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email}'s Subscription"

    def clean(self):
        if self.end_date <= timezone.now():
            raise ValidationError("End date must be in the future")
        
        if self.status == SubscriptionStatus.ACTIVE.value and not self.payment_method:
            raise ValidationError("Active subscriptions must have a payment method")

    def save(self, *args, **kwargs):
        # Set end date for free trial if not set
        if self.status == SubscriptionStatus.TRIAL.value and not self.end_date:
            self.end_date = timezone.now() + timezone.timedelta(days=30)
        
        # Set next billing date for premium subscriptions
        if self.plan == SubscriptionPlan.PREMIUM.value and self.status == SubscriptionStatus.ACTIVE.value:
            if not self.next_billing_date:
                self.next_billing_date = timezone.now() + timezone.timedelta(days=30)
        
        super().save(*args, **kwargs)

    @property
    def is_trial_active(self):
        return (
            self.status == SubscriptionStatus.TRIAL.value and 
            self.end_date > timezone.now()
        )

    @property
    def is_premium_active(self):
        return (
            self.status == SubscriptionStatus.ACTIVE.value and 
            self.is_active and
            (self.next_billing_date is None or self.next_billing_date > timezone.now())
        )

    @property
    def can_access_service(self):
        """Check if subscription is currently active"""
        now = timezone.now()
    
        if self.status == 'trial':
            return self.end_date > now if self.end_date else False
        elif self.status == 'active':
            # For active subscriptions, check next billing date if it exists
            if self.next_billing_date:
                return self.next_billing_date > now
            return True
        return False

class Payment(models.Model):
    subscription = models.ForeignKey(
        Subscription,
        on_delete=models.CASCADE,
        related_name='payments'
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(
        max_length=50, 
        choices=[('mpesa', 'MPESA'), ('card', 'Credit Card')],
        blank=True, null=True
    )
    transaction_id = models.CharField(max_length=100)
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('completed', 'Completed'),
            ('failed', 'Failed'),
            ('refunded', 'Refunded')
        ],
        default='pending'
    )
    payment_date = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True, null=True)
    receipt_sent = models.BooleanField(default=False)

    def __str__(self):
        return f"Payment #{self.id} for {self.subscription.user.email}"