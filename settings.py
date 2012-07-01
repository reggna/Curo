# Django settings for Curo project.

# Enable debug
DEBUG = True
TEMPLATE_DEBUG = DEBUG

# URL Config
ROOT_URLCONF = 'urls'

# Installed applicatiosn
INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.admin',
    'django.contrib.admindocs',
    'tastypie',
    'curo-api',
    'curo-client'
)

# Load local settings from local_settings.py
try:
    from local_settings import *
except ImportError, exp:
    pass

