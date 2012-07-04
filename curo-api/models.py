from django.db import models

class Category(models.Model):
    """ Category """
    name             = models.CharField(max_length=100)
    parent           = models.ForeignKey('self', null=True, blank=True)
    note             = models.TextField(blank=True)

    created          = models.DateTimeField(auto_now_add=True)
    updated          = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return self.name

class Entity(models.Model):
    """ Entity (might represent both physical persons and legal persons) """
    name             = models.CharField(max_length=200)
    note             = models.TextField(blank=True)

    created          = models.DateTimeField(auto_now_add=True)
    updated          = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return self.name

class File(models.Model):
    """ File """
    name             = models.CharField(max_length=400)
    file             = models.FileField(upload_to='files')
    note             = models.TextField(blank=True)

    created          = models.DateTimeField(auto_now_add=True)
    updated          = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return self.name

class Transaction(models.Model):
    """ Transaction """
    category         = models.ForeignKey(Category, related_name='transactions')
    entity           = models.ForeignKey(Entity, related_name='transactions')
    order_date       = models.DateField()
    transaction_date = models.DateField()
    amount           = models.IntegerField()
    transactions     = models.ManyToManyField('self',null=True,blank=True)
    files            = models.ManyToManyField(File,null=True,blank=True)
    note             = models.TextField(blank=True)

    created          = models.DateTimeField(auto_now_add=True)
    updated          = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return u'%d %s' % (self.amount, self.note)

