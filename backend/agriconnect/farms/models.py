from django.db import models
from accounts.models import Farmer

class Farm(models.Model):
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    specialty = models.CharField(max_length=255)
    description = models.TextField()
    image = models.ImageField(upload_to='farm_images/', null=True, blank=True)
    farmer = models.ForeignKey(Farmer, on_delete=models.CASCADE, related_name='farms')

    def __str__(self):
        return self.name