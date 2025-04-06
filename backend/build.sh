#!/bin/bash
set -o errexit

pip install -r backend/requirements.txt
python backend/manage.py collectstatic --noinput
python backend/manage.py migrate