# subscriptions/tasks.py
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils import timezone
from datetime import timedelta
from celery import shared_task
from .models import Subscription
from django.conf import settings

@shared_task
def send_trial_ending_notification():
    # Notify users 3 days before trial ends
    threshold = timezone.now() + timedelta(days=3)
    subscriptions = Subscription.objects.filter(
        status='trial',
        end_date__lte=threshold,
        trial_ending_notification_sent=False
    )
    
    for subscription in subscriptions:
        context = {
            'user': subscription.user,
            'days_remaining': (subscription.end_date - timezone.now()).days,
            'subscription': subscription
        }
        
        html_message = render_to_string(
            'subscriptions/emails/trial_ending.html', 
            context
        )
        
        send_mail(
            subject='Your AgriConnect trial is ending soon',
            message='',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[subscription.user.email],
            html_message=html_message
        )
        
        subscription.trial_ending_notification_sent = True
        subscription.save()

@shared_task
def send_subscription_expired_notification():
    # Notify users when subscription expires
    subscriptions = Subscription.objects.filter(
        end_date__lte=timezone.now(),
        status='trial',
        expired_notification_sent=False
    )
    
    for subscription in subscriptions:
        context = {
            'user': subscription.user,
            'subscription': subscription
        }
        
        html_message = render_to_string(
            'subscriptions/emails/subscription_expired.html', 
            context
        )
        
        send_mail(
            subject='Your AgriConnect subscription has expired',
            message='',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[subscription.user.email],
            html_message=html_message
        )
        
        subscription.expired_notification_sent = True
        subscription.save()

@shared_task
def send_payment_receipt(payment_id):
    from .models import Payment
    
    try:
        payment = Payment.objects.get(id=payment_id)
        context = {
            'user': payment.subscription.user,
            'payment': payment,
            'subscription': payment.subscription
        }
        
        html_message = render_to_string(
            'subscriptions/emails/payment_receipt.html', 
            context
        )
        
        send_mail(
            subject=f'Payment receipt for AgriConnect {payment.subscription.get_plan_display()}',
            message='',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[payment.subscription.user.email],
            html_message=html_message
        )
        
        payment.receipt_sent = True
        payment.save()
    except Payment.DoesNotExist:
        pass