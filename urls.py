from django.conf.urls.defaults import patterns, include, url
from django.contrib import admin
from tastypie.api import Api
from Curo.api import TransactionResource, CategoryResource, EntityResource, FileResource

api = Api(api_name="api")
api.register(TransactionResource())
api.register(CategoryResource())
api.register(EntityResource())
api.register(FileResource())

admin.autodiscover()

urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls)),
    url(r'^', include(api.urls)),
)

