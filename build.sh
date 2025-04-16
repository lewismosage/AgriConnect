#!/usr/bin/env bash

# Set Python path explicitly
export PYTHONPATH="${PYTHONPATH}:/opt/render/project/src:/opt/render/project/src/backend"

echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

echo "Python path: ${PYTHONPATH}"

echo "Testing module import..."
python -c "from agriconnect import settings; print('Successfully imported settings')"

echo "Applying database migrations..."
python backend/manage.py migrate

echo "Collecting static files..."
python backend/manage.py collectstatic --noinput

# Clears all data but keep tables
echo "Resetting database..."
python backend/manage.py flush --no-input  # Clear all data but keep tables

echo "Applying database migrations..."
python backend/manage.py migrate