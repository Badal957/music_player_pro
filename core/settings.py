import os
from pathlib import Path
from django.templatetags.static import static

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "django-insecure-vjrl=7!ousp^5+wcl_i921&8+3kam#8-hxv5vaktnj9%51^8o2"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']

# Application definition
INSTALLED_APPS = [
    "unfold",  # <-- MUST BE AT THE VERY TOP
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Required Third-Party Apps
    'rest_framework',
    'django_filters',  # <-- ADD THIS HERE
    'corsheaders',
    
    # Your custom music app
    'api',
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",  # <-- 1. ADD THIS EXACTLY HERE
    "corsheaders.middleware.CorsMiddleware",  # CORS must stay high up!
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware', # ADD THIS LINE HERE
    'django.contrib.sessions.middleware.SessionMiddleware',
    # ... the rest of your middleware
]

ROOT_URLCONF = "core.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "core.wsgi.application"

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# Internationalization
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True


# --- STATIC AND MEDIA FILES ---
STATIC_URL = "static/"
# THIS TELLS DJANGO WHERE YOUR CSS FOLDER IS
STATICFILES_DIRS = [BASE_DIR / 'static']

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'


# --- CORS CONFIGURATION ---
CORS_ALLOW_ALL_ORIGINS = True 
CORS_ALLOW_CREDENTIALS = True
CORS_EXPOSE_HEADERS = ['Content-Type', 'Accept-Ranges', 'Content-Length']
CORS_ALLOW_HEADERS = ['*']


DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# --- WHITENOISE CONFIGURATION ---
WHITENOISE_USE_FINDERS = True
WHITENOISE_AUTOREFRESH = DEBUG


# --- UNFOLD ADMIN DASHBOARD THEME ---
UNFOLD = {
    "SITE_TITLE": "Studio Admin",
    "SITE_HEADER": "Music Library Manager",
    "SITE_SYMBOL": "library_music",  # Changed from SITE_ICON so it uses a built-in font icon!
    "COLORS": {
        "primary": {
            "50": "#faf5ff",
            "100": "#f3e8ff",
            "200": "#e9d5ff",
            "300": "#d8b4fe",
            "400": "#c084fc",
            "500": "#a855f7",  # Your exact React purple
            "600": "#9333ea",
            "700": "#7e22ce",
            "800": "#6b21a8",
            "900": "#581c87",
        },
    },
    "SIDEBAR": {
        "show_search": True,  
        "show_all_applications": True,
    },
    "STYLES": [
        # UPDATE THIS EXACT LINE RIGHT HERE:
        lambda request: static("css/admin_border.css"),
    ],
}


REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
}
