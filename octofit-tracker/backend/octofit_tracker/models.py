from django.db import models


class OctoFitUser(models.Model):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    age = models.IntegerField(default=0)
    fitness_level = models.CharField(max_length=50, default='beginner')

    class Meta:
        db_table = 'users'

    def __str__(self):
        return self.username


class Team(models.Model):
    name = models.CharField(max_length=150, unique=True)
    members = models.ManyToManyField(OctoFitUser, related_name='teams', blank=True)

    class Meta:
        db_table = 'teams'

    def __str__(self):
        return self.name


class Activity(models.Model):
    user = models.ForeignKey(OctoFitUser, on_delete=models.CASCADE, related_name='activities')
    activity_type = models.CharField(max_length=100)
    duration = models.FloatField(help_text='Duration in minutes')
    date = models.DateField()

    class Meta:
        db_table = 'activities'

    def __str__(self):
        return f"{self.user.username} - {self.activity_type}"


class Leaderboard(models.Model):
    user = models.ForeignKey(OctoFitUser, on_delete=models.CASCADE, related_name='leaderboard_entries')
    score = models.IntegerField(default=0)

    class Meta:
        db_table = 'leaderboard'
        ordering = ['-score']

    def __str__(self):
        return f"{self.user.username}: {self.score}"


class Workout(models.Model):
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    exercises = models.JSONField(default=list)

    class Meta:
        db_table = 'workouts'

    def __str__(self):
        return self.name
