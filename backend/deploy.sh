#!/bin/bash
# Exit immediately if a command exits with a non-zero status
set -e

# Install dependencies
pip install -r requirements.txt

# Apply database migrations
python manage.py migrate --no-input

# Collect static files
python manage.py collectstatic --no-input

# Start server
exec gunicorn agriconnect.wsgi:application --bind 0.0.0.0:$PORT --timeout 120