from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from subscriptions.tasks import send_trial_ending_notification

class Command(BaseCommand):
    help = 'Check for expiring trials and send notifications'
    
    def handle(self, *args, **options):
        send_trial_ending_notification.delay()
        self.stdout.write('Successfully checked for expiring trials')