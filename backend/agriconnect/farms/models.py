# farms/models.py
from django.conf import settings
from django.db import models

class Farm(models.Model):
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    description = models.TextField()
    image = models.ImageField(upload_to='farm_images/', null=True, blank=True)
    farmer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='farms')
    specialty = models.CharField(max_length=255, default="Agriculture")
    rating = models.FloatField(default=0)
    ratings = models.JSONField(default=list)

    def __str__(self):
        return self.name