from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import OctoFitUser, Team, Activity, Leaderboard, Workout
from datetime import date


class OctoFitUserTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = OctoFitUser.objects.create(
            username='thor',
            email='thor@asgard.com',
            password='password123',
            age=1500,
            fitness_level='elite',
        )

    def test_list_users(self):
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_create_user(self):
        data = {
            'username': 'loki',
            'email': 'loki@asgard.com',
            'password': 'trickster123',
            'age': 1050,
            'fitness_level': 'advanced',
        }
        response = self.client.post('/api/users/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['username'], 'loki')


class TeamTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = OctoFitUser.objects.create(
            username='hulk',
            email='bruce@gamma.com',
            password='password123',
            age=45,
            fitness_level='elite',
        )
        self.team = Team.objects.create(name='Team Avengers')
        self.team.members.set([self.user])

    def test_list_teams(self):
        response = self.client.get('/api/teams/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_create_team(self):
        data = {'name': 'Team X-Men', 'member_ids': [self.user.pk]}
        response = self.client.post('/api/teams/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'Team X-Men')


class ActivityTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = OctoFitUser.objects.create(
            username='hawkeye',
            email='clint@shield.com',
            password='password123',
            age=40,
            fitness_level='advanced',
        )

    def test_list_activities(self):
        Activity.objects.create(
            user=self.user,
            activity_type='Archery Training',
            duration=60.0,
            date=date.today(),
        )
        response = self.client.get('/api/activities/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_create_activity(self):
        data = {
            'user_id': self.user.pk,
            'activity_type': 'Rooftop Sprint',
            'duration': 30.0,
            'date': str(date.today()),
        }
        response = self.client.post('/api/activities/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class LeaderboardTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = OctoFitUser.objects.create(
            username='antman',
            email='scott@pym.com',
            password='password123',
            age=38,
            fitness_level='intermediate',
        )

    def test_list_leaderboard(self):
        Leaderboard.objects.create(user=self.user, score=7500)
        response = self.client.get('/api/leaderboard/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)


class WorkoutTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_list_workouts(self):
        Workout.objects.create(
            name='Pym Particle Training',
            description='Shrink and grow your way to fitness.',
            exercises=[{'name': 'Micro Squat', 'sets': 3, 'reps': 20}],
        )
        response = self.client.get('/api/workouts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_create_workout(self):
        data = {
            'name': 'Vision Mind & Body',
            'description': 'Synthesize strength and flexibility.',
            'exercises': [{'name': 'Phase Push-up', 'sets': 4, 'reps': 15}],
        }
        response = self.client.post('/api/workouts/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'Vision Mind & Body')


class APIRootTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_api_root(self):
        response = self.client.get('/api/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('users', response.data)
        self.assertIn('teams', response.data)
        self.assertIn('activities', response.data)
        self.assertIn('leaderboard', response.data)
        self.assertIn('workouts', response.data)

    def test_root_redirects_to_api(self):
        response = self.client.get('/')
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_301_MOVED_PERMANENTLY, status.HTTP_302_FOUND])
