from tastypie import fields
from tastypie.resources import ModelResource
from tastypie.authorization import Authorization
from models import Transaction, Category, Entity, File

class CategoryResource(ModelResource):
    class Meta:
        queryset = Category.objects.all()
        resource_name = 'category'
        authorization = Authorization()

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

    category     = fields.ForeignKey(CategoryResource, 'category')
    entity       = fields.ForeignKey(EntityResource, 'entity')
    files        = fields.ToManyField(FileResource, 'files', null=True)
    transactions = fields.ToManyField(FileResource, 'transactions', null=True)

    class Meta:
        queryset = Transaction.objects.all()
        resource_name = 'transaction'
        authorization = Authorization()

