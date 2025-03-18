from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # User type flags
    is_farmer = models.BooleanField(default=False)
    is_consumer = models.BooleanField(default=False)

    # Common fields
    phone = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)

    # Farmer-specific fields
    is_premium = models.BooleanField(default=False)
    subscription_end_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.username