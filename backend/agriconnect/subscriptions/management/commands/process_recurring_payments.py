from django.core.management.base import BaseCommand
from django.utils import timezone
from subscriptions.models import Subscription, Payment
from subscriptions.tasks import send_payment_receipt

class Command(BaseCommand):
    help = 'Process recurring payments for active subscriptions'
    
    def handle(self, *args, **options):
        today = timezone.now().date()
        subscriptions = Subscription.objects.filter(
            status='active',
            next_billing_date__lte=today,
            is_active=True
        )
        
        for subscription in subscriptions:
            try:
                # In a real implementation, you would integrate with a payment gateway here
                payment = Payment.objects.create(
                    subscription=subscription,
                    amount=subscription.get_plan_price(),
                    payment_method=subscription.payment_method,
                    transaction_id=f"recur_{timezone.now().timestamp()}",
                    status='completed',
                    description=f"Recurring payment for {subscription.get_plan_display()}"
                )
                
                # Update next billing date
                subscription.next_billing_date = today + timedelta(days=30)
                subscription.save()
                
                # Send receipt
                send_payment_receipt.delay(payment.id)
                
                self.stdout.write(f"Processed payment for {subscription.user.email}")
            except Exception as e:
                self.stdout.write(f"Failed to process payment for {subscription.user.email}: {str(e)}")
                # Mark payment as failed
                Payment.objects.create(
                    subscription=subscription,
                    amount=subscription.get_plan_price(),
                    payment_method=subscription.payment_method,
                    transaction_id=f"failed_{timezone.now().timestamp()}",
                    status='failed',
                    description=f"Failed recurring payment for {subscription.get_plan_display()}"
                )