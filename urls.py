from django.conf.urls.defaults import patterns, include, url

urlpatterns = patterns('',
    url(r'^categories/$', 'polls.views.index'),
    url(r'^categories/(?P<category_id>\d+)/$', 'polls.views.detail'),
    url(r'^$', 'Curo.transaction_view.index'),
)
