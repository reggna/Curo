from django.db import models

class Category(models.Model):
	name = models.CharField(max_length=100)
	parent = models.ForeignKey('self')
	
	def __unicode__(self):
		return self.name

class Participant(models.Model):
	name = models.CharField(max_length=200)
	
	def __unicode__(self):
		return self.name

class AssociatedFile(models.Model):
	name = models.CharField(max_length=400)
	file = models.FileField(upload_to='files')
	
	def __unicode__(self):
		return self.name

class Transaction(models.Model):
	category = models.ForeignKey(Category)
	sender = models.ForeignKey(Participant, related_name='transaction_sender')
	receiver = models.ForeignKey(Participant, related_name='transaction_receiver')
	order_date = models.DateField()
	transaction_date = models.DateField()
	amount = models.IntegerField()
	transactions = models.ManyToManyField('self')
	created = models.DateTimeField(auto_now_add=True)
	updated = models.DateTimeField(auto_now=True)
	associated_files = models.ManyToManyField(AssociatedFile)
