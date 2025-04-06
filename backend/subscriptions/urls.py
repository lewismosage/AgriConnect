# subscriptions/urls.py
from django.urls import path
from .views import (
    SubscriptionView,
    CreateSubscriptionView,
    UpdateSubscriptionView,
    PaymentView,
    CheckSubscriptionAccess,
    SubscriptionPlansView,
    CancelSubscriptionView,
    PaymentHistoryView

)

urlpatterns = [
    path('', SubscriptionView.as_view(), name='subscription-detail'),
    path('create/', CreateSubscriptionView.as_view(), name='create-subscription'),
    path('update/', UpdateSubscriptionView.as_view(), name='update-subscription'),
    path('pay/', PaymentView.as_view(), name='make-payment'),
    path('check-access/', CheckSubscriptionAccess.as_view(), name='check-access'),
    path('payments/', PaymentHistoryView.as_view(), name='payment-history'),
    path('cancel/', CancelSubscriptionView.as_view(), name='cancel-subscription'),
    path('plans/', SubscriptionPlansView.as_view(), name='subscription-plans'),
]