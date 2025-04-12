from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from farms.models import Farm
from cloudinary.models import CloudinaryField

class User(AbstractUser):
    USER_TYPE_CHOICES = (
        ('farmer', 'Farmer'),
        ('consumer', 'Consumer'),
    )
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='consumer')
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    profile_picture = CloudinaryField('profile_pictures', blank=True, null=True)
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
    farm_image = CloudinaryField('farm_images', blank=True, null=True)
    farm = models.OneToOneField(Farm, on_delete=models.CASCADE, related_name='farmer_profile', null=True, blank=True)
    about = models.TextField(blank=True, null=True)
    sustainability = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.user.username

class ShippingAddress(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='shipping_addresses')
    name = models.CharField(max_length=255)
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.city}, {self.state}"

class PaymentMethod(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='payment_methods')
    card_type = models.CharField(max_length=20)
    last_four = models.CharField(max_length=4)
    expiry_month = models.CharField(max_length=2)
    expiry_year = models.CharField(max_length=4)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.card_type} ending in {self.last_four}"