import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
import joblib
import os

DATA_DIR   = os.path.join(os.path.dirname(__file__), 'data')
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model.pkl')


def train():
    ratings = pd.read_csv(os.path.join(DATA_DIR, 'ratings.csv'))
    movies  = pd.read_csv(os.path.join(DATA_DIR, 'movies.csv'))

    matrix = ratings.pivot_table(
        index='movieId',
        columns='userId',
        values='rating'
    ).fillna(0)

    similarity = cosine_similarity(matrix)

    ml_to_index = {}
    index_to_ml = {}

    for i, movie_id in enumerate(matrix.index):
        ml_to_index[movie_id] = i
        index_to_ml[i] = movie_id

    # Build genre lookup per movieId
    genre_map = {}
    for _, row in movies.iterrows():
        genres = set(row['genres'].split('|')) if pd.notna(row['genres']) else set()
        genre_map[row['movieId']] = genres

    joblib.dump({
        'similarity':  similarity,
        'movies':      movies,
        'ml_to_index': ml_to_index,
        'index_to_ml': index_to_ml,
        'genre_map':   genre_map,
    }, MODEL_PATH)


if __name__ == '__main__':
    train()