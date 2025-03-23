from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from farms.models import Farm  # Now this import is safe

class User(AbstractUser):
    USER_TYPE_CHOICES = (
        ('farmer', 'Farmer'),
        ('consumer', 'Consumer'),
    )
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='consumer')
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    is_premium = models.BooleanField(default=False)
    subscription_end_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.username

class FarmerProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='farmer_profile')
    farm_name = models.CharField(max_length=255, blank=True, null=True)
    location = models.CharField(max_length=255)
    specialty = models.CharField(max_length=255)
    description = models.TextField()
    farm_image = models.ImageField(upload_to='farm_images/', blank=True, null=True)
    farm = models.OneToOneField(Farm, on_delete=models.CASCADE, related_name='farmer_profile', null=True, blank=True)

    def __str__(self):
        return self.user.username