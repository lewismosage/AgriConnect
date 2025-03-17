from django.db import models
from accounts.models import User

class Farm(models.Model):
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    description = models.TextField()
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='farms')
    image = models.ImageField(upload_to='farms/', blank=True, null=True)

    def __str__(self):
        return self.name