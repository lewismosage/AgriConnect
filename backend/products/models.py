# products/models.py
from django.db import models
from farms.models import Farm
from django.core.validators import FileExtensionValidator

class Product(models.Model):
    name = models.CharField(max_length=255)
    farm = models.ForeignKey(Farm, on_delete=models.CASCADE, related_name='products')
    category = models.CharField(max_length=255, default="General")
    quantity = models.FloatField(default=0.0)
    unit = models.CharField(max_length=50, default="unit")
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    image = models.ImageField(
        upload_to='products/',
        blank=True,
        null=True,
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'])]
    )

    def __str__(self):
        return self.name