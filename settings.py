# Django settings for Curo project.

SECRET_KEY = '50-char-long-(or-so)-secret-key'

# Enable debug
DEBUG = True
TEMPLATE_DEBUG = DEBUG

# URL Config
ROOT_URLCONF = 'urls'

# Database connections
# For MySQL
#DATABASES = {
#    'default': {
#        'ENGINE': 'django.db.backends.mysql',
#        'NAME': 'curo',
#        'USER': 'username',
#        'PASSWORD': 'password',
#        'HOST': 'hostname',
#        'PORT': 'port',
#    }
#}

# For SQLite
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': 'curo.db',
    }
}

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

FIXTURE_DIRS = (
    'fixtures',
)

# Load local settings from local_settings.py
try:
    from local_settings import *
except ImportError, exp:
    pass



