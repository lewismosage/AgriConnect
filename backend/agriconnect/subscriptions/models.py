from django.db import models
from accounts.models import User

class Subscription(models.Model):
    farmer = models.OneToOneField(User, on_delete=models.CASCADE, related_name='subscription')
    payment_method = models.CharField(max_length=50, choices=[('mpesa', 'MPESA'), ('bank', 'Bank')])
    mpesa_number = models.CharField(max_length=15, blank=True, null=True)
    card_number = models.CharField(max_length=16, blank=True, null=True)
    expiry_date = models.CharField(max_length=5, blank=True, null=True)
    cvv = models.CharField(max_length=3, blank=True, null=True)
    name_on_card = models.CharField(max_length=255, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    start_date = models.DateField(auto_now_add=True)
    end_date = models.DateField()

    def __str__(self):
        return f"{self.farmer.username}'s Subscription"