# views.py
from django.db.models import Count # type: ignore
from django.shortcuts import render # type: ignore
from rest_framework.views import APIView # type: ignore
from .models import *
from rest_framework.response import Response # type: ignore
from .serializer import MatchSerializer

class MatchStatsView(APIView): 
    
    def get(self, request): 
        # Retrieve all matches from the database
        matches = Match.objects.all()
        
        # Calculate total number of matches played per year
        matches_per_year = {}
        for match in matches:
            year = match.date.year
            if year in matches_per_year:
                matches_per_year[year] += 1
            else:
                matches_per_year[year] = 1
        
        # Convert dictionary to list of dictionaries
        matches_per_year_data = [{'year': year, 'num_matches': num_matches} for year, num_matches in matches_per_year.items()]

        return Response(matches_per_year_data)

class MatchWinView(APIView):

    def get(self, request):
        # Retrieve all matches from the database
        matches = Match.objects.all()
        
        # Calculate the number of matches won by each team over all the years
        matches_won_by_team = Match.objects.values('winner', 'date__year').annotate(num_wins=Count('winner')).order_by('winner', 'date__year')

        # Organize data for plotting stacked bar graph
        stacked_data = {}
        for match in matches_won_by_team:
            team = match['winner']
            year = match['date__year']
            num_wins = match['num_wins']

            if team is not None:  # Filter out null teams
                if team not in stacked_data:
                    stacked_data[team] = {}

                if year not in stacked_data[team]:
                    stacked_data[team][year] = num_wins
                else:
                    stacked_data[team][year] += num_wins

        # Convert data to the format expected by the frontend
        stacked_data_list = []
        for team, years in stacked_data.items():
            team_data = {'team': team, 'years': []}
            for year, num_wins in years.items():
                team_data['years'].append({'year': year, 'num_wins': num_wins})
            stacked_data_list.append(team_data)

        return Response(stacked_data_list)

class TopBowlersView(APIView):
    def get(self, request):
        # year=2017
        year = request.query_params.get('year', None)
        print("Year:", year)
        if year is None:
            return Response({'error': 'Year parameter is required'}, status=400)
        
        match_ids = Match.objects.filter(season=year).values_list('id', flat=True)
        
        bowler_stats = {}
        for match_id in match_ids:
            deliveries = Deliveries.objects.filter(match_id=match_id)
            for delivery in deliveries:
                bowler = delivery.bowler
                runs = delivery.total_runs
                if bowler in bowler_stats:
                    bowler_stats[bowler]['runs'] += runs
                    bowler_stats[bowler]['balls'] += 1
                else:
                    bowler_stats[bowler] = {'runs': runs, 'balls': 1}
        
        # Calculate overs bowled for each bowler
        for bowler, stats in bowler_stats.items():
            balls = stats['balls']
            overs = balls // 6  # Integer division to get the number of overs
            balls_remainder = balls % 6  # Calculate remaining balls after complete overs
            overs_str = f"{overs}.{balls_remainder}"  # Represent overs as string
            bowler_stats[bowler]['overs'] = overs_str
        
        # Calculate economy for each bowler and round off to two decimal places
        for bowler, stats in bowler_stats.items():
            runs = stats['runs']
            balls = stats['balls']
            economy = round((runs / balls) * 6, 2) if balls > 0 else 0
            bowler_stats[bowler]['economy'] = economy
        
        # Sort bowlers by economy and get top ten
        top_bowlers = sorted(bowler_stats.items(), key=lambda x: x[1]['economy'])[:10]
        
        # Prepare response
        top_bowlers_response = [{'bowler': bowler, 'economy': stats['economy'], 'overs': stats['overs']} for bowler, stats in top_bowlers]
        
        return Response(top_bowlers_response)

