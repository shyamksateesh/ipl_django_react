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

class Deliveries(models.Model):
    delivery_id = models.AutoField(primary_key=True)
    match_id = models.IntegerField(default=0)
    inning = models.IntegerField(default=0)
    batting_team = models.CharField(max_length=255, default="null")
    bowling_team = models.CharField(max_length=255, default="null")
    over = models.IntegerField(default=0)
    ball = models.IntegerField(default=0)
    batsman = models.CharField(max_length=255, default="null")
    non_striker = models.CharField(max_length=255, default="null")
    bowler = models.CharField(max_length=255, default="null")
    is_super_over = models.IntegerField(default=0)
    wide_runs = models.IntegerField(default=0)
    bye_runs = models.IntegerField(default=0)
    legbye_runs = models.IntegerField(default=0)
    noball_runs = models.IntegerField(default=0)
    penalty_runs = models.IntegerField(default=0)
    batsman_runs = models.IntegerField(default=0)
    extra_runs = models.IntegerField(default=0)
    total_runs = models.IntegerField(default=0)
    player_dismissed = models.CharField(max_length=255, default="null")
    dismissal_kind = models.CharField(max_length=255, default="null")
    fielder = models.CharField(max_length=255, default="null")

    def __str__(self):
        return f"Delivery {self.delivery_id}"
    
    class Meta:
        db_table = 'deliveries'  # Specify the database table name
