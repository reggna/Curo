from django.conf.urls.defaults import patterns, include, url
from django.views.generic.simple import redirect_to
import os

# TODO: This servers files from the client directory with the static.server
#       functionality. This is not recommended for production use!

PATH = os.path.dirname(os.path.realpath(__file__))

urlpatterns = patterns('',
    (r'^client/css/(?P<path>.*)$', 'django.views.static.serve', {'document_root': PATH + "/css/"}),
    (r'^client/script/(?P<path>.*)$', 'django.views.static.serve', {'document_root': PATH + "/script/"}),
    (r'^client/partials/(?P<path>.*)$', 'django.views.static.serve', {'document_root': PATH + "/partials/"}),
    (r'^client/.*$', 'django.views.static.serve', {'path': "client.html", 'document_root': PATH + "/"}),
    (r'^$',  redirect_to, {'url': '/client/'}),
)

