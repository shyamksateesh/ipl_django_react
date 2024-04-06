from django.db import models # type: ignore

class Match(models.Model):
    id = models.AutoField(primary_key=True)
    season = models.IntegerField()
    city = models.CharField(max_length=255)
    date = models.DateField()
    team1 = models.CharField(max_length=255)
    team2 = models.CharField(max_length=255)
    toss_winner = models.CharField(max_length=255)
    toss_decision = models.CharField(max_length=255)
    result = models.CharField(max_length=255)
    dl_applied = models.IntegerField()
    winner = models.CharField(max_length=255)
    win_by_runs = models.IntegerField()
    win_by_wickets = models.IntegerField()
    player_of_match = models.CharField(max_length=255)
    venue = models.CharField(max_length=255)
    umpire1 = models.CharField(max_length=255)
    umpire2 = models.CharField(max_length=255)

    def __str__(self):
        return f"Match {self.id}"
    
    class Meta:
        db_table = 'matches'  # Specify the database table name
