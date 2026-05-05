# 🎬 Movie Recommender

A full stack movie recommendation web app built with Django, React, and Machine Learning.
Uses collaborative filtering on the MovieLens dataset to recommend movies based on user preferences.

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Django + Django REST Framework
- **ML:** scikit-learn (Item-Based Collaborative Filtering)
- **Database:** PostgreSQL
- **Dataset:** MovieLens Latest Small (100k ratings)

---

## Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL running locally

---

### Backend

1. Navigate to backend folder
```bash
   cd backend
```

2. Create and activate virtual environment
```bash
   python3 -m venv .venv
   source .venv/bin/activate        # Mac/Linux
   .venv\Scripts\activate           # Windows
```

3. Install dependencies
```bash
   pip install -r requirements.txt
```

4. Create `.env` file in the backend folder
```
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=
DB_HOST=
DB_PORT=

SECRET_KEY=
DEBUG=

ALLOWED_HOSTS=
ALLOWED_CORS=

MOVIES_API=
```

5. Run migrations
```bash
   python manage.py migrate
```

6. Train the ML model (required before running)
```bash
   python ml/train.py
```

7. Start the server
```bash
   python manage.py runserver
```

Backend runs on `http://localhost:8000`

---

### Frontend

1. Navigate to frontend folder
```bash
   cd frontend
```

2. Install dependencies
```bash
   npm install
```

3. Start the dev server
```bash
   npm run dev
```

Frontend runs on `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/popular/` | Get popular movies |
| GET | `/api/v1/search/?q=` | Search movies |
| GET | `/api/v1/movie/<id>/` | Get movie details |
| GET | `/api/v1/recommend/?title=` | Get ML recommendations |
| POST | `/api/v1/auth/register/` | Register user |
| POST | `/api/v1/auth/login/` | Login user |
| GET | `/api/v1/auth/watchlist/` | Get watchlist |
| POST | `/api/v1/auth/watchlist/` | Add to watchlist |
| PATCH | `/api/v1/auth/watchlist/<id>/` | Update status |
| DELETE | `/api/v1/auth/watchlist/<id>/` | Remove from watchlist |

---

## ML Model

- **Algorithm:** Item-Based Collaborative Filtering
- **Technique:** Cosine Similarity
- **Dataset:** MovieLens Latest Small (100,836 ratings, 9,724 movies, 610 users)
- **Training:** Run `python ml/train.py` to generate `model.pkl`
- **Note:** `model.pkl` is excluded from Git (too large). Must be generated locally.

---

## Notes

- Get a free TMDB API key at [themoviedb.org](https://themoviedb.org)
- `model.pkl` is not included in the repo — run `python ml/train.py` to generate it
- `.env` is not included — create it manually using the template above