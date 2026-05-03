import requests
import os

TMDB_KEY  = os.environ.get('MOVIES_API')
TMDB_BASE = 'https://api.themoviedb.org/3'


def get_popular():
    response = requests.get(
        f'{TMDB_BASE}/movie/popular',
        params={'api_key': TMDB_KEY, 'language': 'en-US'}
    )
    return response.json().get('results', [])[:6]


def search_movies(query):
    response= requests.get(
        f'{TMDB_BASE}/search/movie',
        params={
            'api_key':  TMDB_KEY,
            'query':    query,
            'language': 'en-US',
        }
    )
    return response.json().get('results', [])[:10]


def get_movie_details(tmdb_id):
    response = requests.get(
        f'{TMDB_BASE}/movie/{tmdb_id}',
        params={'api_key': TMDB_KEY, 'language': 'en-US'}
    )
    return response.json()