from rest_framework import serializers # type: ignore
from . models import *
  
class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = ['date', 'team1','team2','winner'] 