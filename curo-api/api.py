from tastypie import fields
from tastypie.resources import ModelResource, ALL
from tastypie.authorization import Authorization
from models import Transaction, Category, Entity, File

class CategoryResource(ModelResource):
    parent = fields.ForeignKey('Curo.curo-api.api.CategoryResource', 'parent', null=True)

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
    entity       = fields.ForeignKey(EntityResource, 'entity', null=True)
    files        = fields.ToManyField(FileResource, 'files', null=True)
    transactions = fields.ToManyField(FileResource, 'transactions', null=True)

    class Meta:
        queryset = Transaction.objects.all()
        resource_name = 'transaction'
        authorization = Authorization()
        filtering = {"order_date": ALL}

class CategoryStatsResource(CategoryResource):
    amount = fields.IntegerField()
    parent = fields.ForeignKey('Curo.curo-api.api.CategoryStatsResource', 'parent', null=True)
    
    class Meta:
        allowed_methods = ['get']
        queryset = Category.objects.all()
        authorization = Authorization()
    
    def dehydrate_amount(self, bundle):
        amount = 0
        for transaction in bundle.obj.transactions.all():
            amount += transaction.amount
        
        return amount

