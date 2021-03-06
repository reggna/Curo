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
    name             = models.CharField(max_length=400, null=True, blank=True)
    file             = models.FileField(upload_to='files', null=True, blank=True)
    note             = models.TextField(null=True, blank=True)

    created          = models.DateTimeField(auto_now_add=True)
    updated          = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return self.name

class Transaction(models.Model):
    """ Transaction """
    category         = models.ForeignKey(Category, related_name='transactions',null=True,blank=True)
    entity           = models.ForeignKey(Entity, related_name='transactions', null=True,blank=True)
    order_date       = models.DateField()
    transaction_date = models.DateField(null=True,blank=True)
    amount           = models.IntegerField(null=True,blank=True)
    transactions     = models.ManyToManyField('self', null=True, blank=True)
    files            = models.ManyToManyField(File, null=True, blank=True)
    note             = models.TextField(null=True,blank=True)

    created          = models.DateTimeField(auto_now_add=True)
    updated          = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return u'%d %s' % (self.amount, self.note)

