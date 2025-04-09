#!/usr/bin/env bash
# build.sh

echo "Applying database migrations..."
python backend/manage.py migrate

echo "Collecting static files..."
python backend/manage.py collectstatic --noinput
