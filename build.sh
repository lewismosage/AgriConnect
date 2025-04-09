echo "Applying migrations..."
python backend/manage.py migrate

echo "Collecting static files..."
python backend/manage.py collectstatic --noinput
