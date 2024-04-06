from django.shortcuts import render  # type: ignore
from rest_framework.views import APIView  # type: ignore
from . models import *
from rest_framework.response import Response  # type: ignore
from . serializer import *

class MatchView(APIView): 
    
    serializer_class = MatchSerializer
  
    def get(self, request): 
        detail = [ {"date": detail.date,"team1": detail.team1, "team2": detail.team2, "winner": detail.winner}
        for detail in Match.objects.all()]
        return Response(detail) 
  
    def post(self, request): 
  
        serializer = MatchSerializer(data=request.data) 
        if serializer.is_valid(raise_exception=True): 
            serializer.save() 
            return  Response(serializer.data) 