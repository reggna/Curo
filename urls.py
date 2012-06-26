from django.conf.urls.defaults import patterns, include, url

urlpatterns = patterns('',
    url(r'^', include('api.urls')),
    url(r'^', include('client.urls'))
)

