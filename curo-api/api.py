from tastypie import fields
from tastypie.resources import ModelResource, ALL
from tastypie.authorization import Authorization
from tastypie.utils.urls import trailing_slash
from django.conf.urls.defaults import patterns, url
from models import Transaction, Category, Entity, File

class CategoryResource(ModelResource):
    parent = fields.ForeignKey('Curo.curo-api.api.CategoryResource', 'parent', null=True)

    class Meta:
        queryset = Category.objects.all()
        resource_name = 'category'
        authorization = Authorization()
        filtering = {
            'parent': ALL,
            'name': ALL
        }

class EntityResource(ModelResource):
    class Meta:
        queryset = Entity.objects.all()
        resource_name = 'entity'
        authorization = Authorization()

class FileResource(ModelResource):
    class Meta:
        queryset = File.objects.all()
        resource_name = 'file'
        authorization = Authorization()

class TransactionResource(ModelResource):

    category     = fields.ForeignKey(CategoryResource, 'category', null=True, blank=True)
    entity       = fields.ForeignKey(EntityResource, 'entity', null=True, blank=True)
    files        = fields.ToManyField(FileResource, 'files', null=True, blank=True)
    transactions = fields.ToManyField(FileResource, 'transactions', null=True, blank=True)

    class Meta:
        queryset = Transaction.objects.all()
        resource_name = 'transaction'
        authorization = Authorization()
        filtering = {
            'order_date': ALL,
        }
