import joblib
import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model.pkl')

_model = None


def load_model():
    global _model
    if _model is None:
        _model = joblib.load(MODEL_PATH)
    return _model


def genre_overlap_score(genres_a, genres_b):
    if not genres_a or not genres_b:
        return 0
    overlap = len(genres_a & genres_b)
    total   = len(genres_a | genres_b)
    return overlap / total  # 0.0 to 1.0


def recommend(movie_title, n=6):
    data        = load_model()
    similarity  = data['similarity']
    movies      = data['movies']
    ml_to_index = data['ml_to_index']
    index_to_ml = data['index_to_ml']
    genre_map   = data['genre_map']

    match = movies[movies['title'].str.contains(
        movie_title, case=False, na=False
    )]

    if match.empty:
        return []

    movie_id     = match.iloc[0]['movieId']
    source_genres = genre_map.get(movie_id, set())
    idx          = ml_to_index.get(movie_id)

    if idx is None:
        return []

    cf_scores = similarity[idx]

    hybrid_scores = []

    for i, cf_score in enumerate(cf_scores):
        if i == idx:
            continue

        candidate_id     = index_to_ml[i]
        candidate_genres = genre_map.get(candidate_id, set())

        genre_score = genre_overlap_score(source_genres, candidate_genres)

        if genre_score == 0:
            continue

        hybrid = (0.6 * cf_score) + (0.4 * genre_score)
        hybrid_scores.append((i, hybrid))

    hybrid_scores.sort(key=lambda x: x[1], reverse=True)

    results = []
    for i, score in hybrid_scores[:n]:
        mid   = index_to_ml[i]
        title = movies[movies['movieId'] == mid]['title'].values
        if len(title):
            results.append(title[0])

    return results