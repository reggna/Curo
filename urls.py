from django.conf.urls.defaults import patterns, include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

urlpatterns = patterns('',
    url(r'^', include('api.urls')),
    url(r'^', include('curo-client.urls'))
)

urlpatterns += staticfiles_urlpatterns()
