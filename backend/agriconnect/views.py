from django.shortcuts import render
from django.http import HttpResponse
from django.db import connection
from django.http import JsonResponse

def home(request):
    return HttpResponse("Welcome to AgriConnect!")

def check_migrations(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT app, name, applied 
                FROM django_migrations 
                WHERE app IN ('farms', 'products')
                ORDER BY applied DESC
            """)
            migrations = cursor.fetchall()
        return JsonResponse({"migrations": migrations})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)