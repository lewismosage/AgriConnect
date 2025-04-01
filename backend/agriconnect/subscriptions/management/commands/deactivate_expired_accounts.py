from django.core.management.base import BaseCommand
from django.utils import timezone
from subscriptions.models import Subscription
from subscriptions.tasks import send_subscription_expired_notification

class Command(BaseCommand):
    help = 'Deactivate expired subscriptions'
    
    def handle(self, *args, **options):
        # First send expiration notifications
        send_subscription_expired_notification.delay()
        
        # Then deactivate subscriptions that are past their grace period (7 days)
        grace_period = timezone.now() - timedelta(days=7)
        expired_subscriptions = Subscription.objects.filter(
            end_date__lte=grace_period,
            status='trial'
        )
        
        for subscription in expired_subscriptions:
            subscription.status = 'expired'
            subscription.is_active = False
            subscription.save()
            self.stdout.write(f"Deactivated subscription for {subscription.user.email}")