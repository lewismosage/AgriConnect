import os
import sys

# Calculate paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
BACKEND_DIR = os.path.join(BASE_DIR, 'backend')

# Add both the project root and backend directory to Python path
sys.path.append(BASE_DIR)
sys.path.append(BACKEND_DIR)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agriconnect.settings')

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()