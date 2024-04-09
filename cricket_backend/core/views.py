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

class WinLoseView(APIView):
    def get(self, request):
        # year = 2017 
        year = request.query_params.get('year', None)
        if year is None:
            return Response({'error': 'Year parameter is required'}, status=400)
        # Calculate the total number of matches played by each team in the specified year
        matches_played_by_team = Match.objects.filter(date__year=year).values('team1', 'team2').annotate(num_matches=Count('id'))
        
        # Calculate the total number of matches won by each team in the specified year
        matches_won_by_team = Match.objects.filter(date__year=year, winner__isnull=False).values('winner').annotate(num_wins=Count('id'))
        
        # Organize data for each team
        teams_data = {}
        for match in matches_played_by_team:
            team1 = match['team1']
            team2 = match['team2']
            num_matches = match['num_matches']
            
            if team1:
                teams_data.setdefault(team1, {'matches_played': 0, 'matches_won': 0})
                teams_data[team1]['matches_played'] += num_matches
            if team2:
                teams_data.setdefault(team2, {'matches_played': 0, 'matches_won': 0})
                teams_data[team2]['matches_played'] += num_matches
        
        for match in matches_won_by_team:
            team = match['winner']
            num_wins = match['num_wins']
            if team:
                teams_data.setdefault(team, {'matches_played': 0, 'matches_won': 0})
                teams_data[team]['matches_won'] += num_wins
        
        # Convert data to the format expected by the frontend
        teams_data_list = [{'team': team, 'matches_played': data['matches_played'], 'matches_won': data['matches_won']} for team, data in teams_data.items()]
        
        return Response(teams_data_list)

class NetRunsView(APIView):
    def get(self, request):
        year = request.query_params.get('year', None)
        if year is None:
            return Response({'error': 'Year parameter is required'}, status=400)
        
        # Get all match IDs for the specified year
        match_ids = Match.objects.filter(date__year=year).values_list('id', flat=True)

        # Calculate net runs conceded for each team
        net_runs_conceded = {}
        for match_id in match_ids:
            # Get deliveries for the current match
            match_deliveries = Deliveries.objects.filter(match_id=match_id)
            for delivery in match_deliveries:
                batting_team = delivery.batting_team
                bowling_team = delivery.bowling_team
                total_runs = delivery.total_runs
                
                # Update net runs conceded for the batting team
                if batting_team:
                    net_runs_conceded[batting_team] = net_runs_conceded.get(batting_team, 0) + total_runs
                
                # Update net runs conceded for the bowling team
                if bowling_team:
                    net_runs_conceded[bowling_team] = net_runs_conceded.get(bowling_team, 0) - total_runs
        
        # Convert net runs conceded data to the desired format
        net_runs_conceded_list = [{'team': team, 'net_runs_conceded': runs_conceded} for team, runs_conceded in net_runs_conceded.items()]
        
        return Response(net_runs_conceded_list)
