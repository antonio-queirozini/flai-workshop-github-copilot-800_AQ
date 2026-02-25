from django.core.management.base import BaseCommand
from octofit_tracker.models import OctoFitUser, Team, Activity, Leaderboard, Workout
from datetime import date


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Clearing existing data...')

        # Delete in correct order to respect FK constraints
        Leaderboard.objects.all().delete()
        Activity.objects.all().delete()
        Team.objects.all().delete()
        OctoFitUser.objects.all().delete()
        Workout.objects.all().delete()

        self.stdout.write('Creating users (superheroes)...')

        users_data = [
            {'username': 'ironman', 'email': 'tony@stark.com', 'password': 'password123', 'age': 45, 'fitness_level': 'advanced'},
            {'username': 'spiderman', 'email': 'peter@marvel.com', 'password': 'password123', 'age': 22, 'fitness_level': 'advanced'},
            {'username': 'blackwidow', 'email': 'natasha@marvel.com', 'password': 'password123', 'age': 35, 'fitness_level': 'elite'},
            {'username': 'captainamerica', 'email': 'steve@marvel.com', 'password': 'password123', 'age': 105, 'fitness_level': 'elite'},
            {'username': 'batman', 'email': 'bruce@dc.com', 'password': 'password123', 'age': 40, 'fitness_level': 'elite'},
            {'username': 'superman', 'email': 'clark@dc.com', 'password': 'password123', 'age': 35, 'fitness_level': 'advanced'},
            {'username': 'wonderwoman', 'email': 'diana@dc.com', 'password': 'password123', 'age': 800, 'fitness_level': 'elite'},
            {'username': 'theflash', 'email': 'barry@dc.com', 'password': 'password123', 'age': 28, 'fitness_level': 'advanced'},
        ]

        users = {}
        for data in users_data:
            user = OctoFitUser.objects.create(**data)
            users[data['username']] = user
            self.stdout.write(f"  Created user: {user.username}")

        self.stdout.write('Creating teams...')

        team_marvel = Team.objects.create(name='Team Marvel')
        team_marvel.members.set([
            users['ironman'], users['spiderman'],
            users['blackwidow'], users['captainamerica'],
        ])
        self.stdout.write(f"  Created team: {team_marvel.name}")

        team_dc = Team.objects.create(name='Team DC')
        team_dc.members.set([
            users['batman'], users['superman'],
            users['wonderwoman'], users['theflash'],
        ])
        self.stdout.write(f"  Created team: {team_dc.name}")

        self.stdout.write('Creating activities...')

        activities_data = [
            {'user': users['ironman'], 'activity_type': 'Iron Man Suit Test Flight', 'duration': 60.0, 'date': date(2026, 2, 1)},
            {'user': users['spiderman'], 'activity_type': 'Web Slinging', 'duration': 45.0, 'date': date(2026, 2, 2)},
            {'user': users['blackwidow'], 'activity_type': 'Combat Training', 'duration': 90.0, 'date': date(2026, 2, 3)},
            {'user': users['captainamerica'], 'activity_type': 'Shield Toss Workout', 'duration': 75.0, 'date': date(2026, 2, 4)},
            {'user': users['batman'], 'activity_type': 'Gotham Night Patrol', 'duration': 120.0, 'date': date(2026, 2, 5)},
            {'user': users['superman'], 'activity_type': 'Flying Laps Around Earth', 'duration': 30.0, 'date': date(2026, 2, 6)},
            {'user': users['wonderwoman'], 'activity_type': 'Lasso of Truth Training', 'duration': 80.0, 'date': date(2026, 2, 7)},
            {'user': users['theflash'], 'activity_type': 'Speed Force Run', 'duration': 5.0, 'date': date(2026, 2, 8)},
        ]

        for data in activities_data:
            activity = Activity.objects.create(**data)
            self.stdout.write(f"  Created activity: {activity}")

        self.stdout.write('Creating leaderboard entries...')

        leaderboard_data = [
            {'user': users['captainamerica'], 'score': 9800},
            {'user': users['wonderwoman'], 'score': 9600},
            {'user': users['batman'], 'score': 9400},
            {'user': users['blackwidow'], 'score': 9200},
            {'user': users['ironman'], 'score': 8800},
            {'user': users['superman'], 'score': 8500},
            {'user': users['spiderman'], 'score': 8200},
            {'user': users['theflash'], 'score': 7900},
        ]

        for data in leaderboard_data:
            entry = Leaderboard.objects.create(**data)
            self.stdout.write(f"  Created leaderboard entry: {entry}")

        self.stdout.write('Creating workouts...')

        workouts_data = [
            {
                'name': 'Avengers Strength Training',
                'description': 'Full body strength workout inspired by Earth\'s Mightiest Heroes.',
                'exercises': [
                    {'name': 'Repulsor Push-ups', 'sets': 4, 'reps': 20},
                    {'name': 'Shield Press', 'sets': 3, 'reps': 15},
                    {'name': 'Web Pull-ups', 'sets': 4, 'reps': 12},
                    {'name': 'Widow\'s Peak Plank', 'sets': 3, 'duration': '60s'},
                ],
            },
            {
                'name': 'Justice League Cardio Blast',
                'description': 'High-intensity cardio session fit for DC\'s finest.',
                'exercises': [
                    {'name': 'Gotham Sprint', 'sets': 5, 'duration': '30s'},
                    {'name': 'Speed Force Burpees', 'sets': 4, 'reps': 15},
                    {'name': 'Kryptonian Jump Squats', 'sets': 3, 'reps': 20},
                    {'name': 'Lasso Rope Jump', 'sets': 4, 'duration': '60s'},
                ],
            },
            {
                'name': 'Superhero Agility Circuit',
                'description': 'Mixed agility and endurance circuit for all heroes.',
                'exercises': [
                    {'name': 'Ladder Drills', 'sets': 3, 'duration': '45s'},
                    {'name': 'Box Jumps', 'sets': 4, 'reps': 10},
                    {'name': 'Cone Weave', 'sets': 3, 'duration': '30s'},
                    {'name': 'Medicine Ball Slam', 'sets': 4, 'reps': 12},
                ],
            },
        ]

        for data in workouts_data:
            workout = Workout.objects.create(**data)
            self.stdout.write(f"  Created workout: {workout.name}")

        self.stdout.write(self.style.SUCCESS('\nDatabase populated successfully!'))
        self.stdout.write(f"  Users: {OctoFitUser.objects.count()}")
        self.stdout.write(f"  Teams: {Team.objects.count()}")
        self.stdout.write(f"  Activities: {Activity.objects.count()}")
        self.stdout.write(f"  Leaderboard entries: {Leaderboard.objects.count()}")
        self.stdout.write(f"  Workouts: {Workout.objects.count()}")
