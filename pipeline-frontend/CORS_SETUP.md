# Backend CORS setup (Django)

For the frontend (http://localhost:5173) to talk to the backend (http://localhost:8000),
add this to your Django `settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]
```

If `corsheaders` isn't already in `INSTALLED_APPS` and `MIDDLEWARE`, add it:

```python
INSTALLED_APPS = [
    ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    ...
]
```

(Your project already has `corsheaders` installed based on the project summary —
just double check `CORS_ALLOWED_ORIGINS` includes the frontend URL.)
