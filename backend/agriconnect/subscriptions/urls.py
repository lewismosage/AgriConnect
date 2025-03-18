from django.urls import path
from .views import SubscriptionCreateView

urlpatterns = [
    path('subscribe/', SubscriptionCreateView.as_view(), name='subscription-create'),
]