import joblib
import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model.pkl')

_model = None


def load_model():
    global _model
    if _model is None:
        _model = joblib.load(MODEL_PATH)
    return _model


def recommend(movie_title, n=6):
    data        = load_model()
    similarity  = data['similarity']
    movies      = data['movies']
    ml_to_index = data['ml_to_index']
    index_to_ml = data['index_to_ml']

    match = movies[movies['title'].str.contains(
        movie_title, case=False, na=False
    )]

    if match.empty:
        return []

    movie_id = match.iloc[0]['movieId']
    idx      = ml_to_index.get(movie_id)

    if idx is None:
        return []

    scores      = similarity[idx]
    top_indices = scores.argsort()[::-1][1:n+1]

    results = []
    for i in top_indices:
        mid   = index_to_ml[i]
        title = movies[movies['movieId'] == mid]['title'].values
        if len(title):
            results.append(title[0])

    return results