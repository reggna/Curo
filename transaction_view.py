from Curo.models import Transaction
from django.http import HttpResponse

def index(request):
	return HttpResponse("test")
