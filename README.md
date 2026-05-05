# 🎬 Movie Recommender

A full stack movie recommendation web app built with Django, React, and Machine Learning.
Uses collaborative filtering on the MovieLens dataset to recommend movies based on user preferences.

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Django + Django REST Framework
- **ML:** scikit-learn (Item-Based Collaborative Filtering)
- **Database:** PostgreSQL
- **Containerisation:** Docker + Nginx
- **Dataset:** MovieLens Latest Small (100k ratings)

---

## Quick Start With Docker (Recommended)

### Prerequisites
- Docker Desktop installed and running

### 1. Clone the repo
```bash
git clone https://github.com/YourUsername/movie-recommender.git
cd movie-recommender
```

### 2. Create `.env` file in the root folder
```
POSTGRES_DB=movie-recommender
POSTGRES_USER=postgres
POSTGRES_PASSWORD=yourpassword
DB_HOST=db
DB_PORT=5432
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1
ALLOWED_CORS=http://localhost
MOVIES_API=your-tmdb-api-key
```

### 3. Run with Docker
```bash
docker compose up --build
```

App runs on `http://localhost`

> The ML model is trained automatically during the Docker build. No manual steps needed.

---

## Manual Setup (Without Docker)

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL running locally

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

4. Create `.env` file in the root folder
```
POSTGRES_DB=movie-recommender
POSTGRES_USER=postgres
POSTGRES_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
ALLOWED_CORS=http://localhost:5173
MOVIES_API=your-tmdb-api-key
```

5. Run migrations
```bash
python manage.py migrate
```

6. Train the ML model
```bash
python ml/train.py
```

7. Start the server
```bash
python manage.py runserver
```

Backend runs on `http://localhost:8000`

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
| POST | `/api/v1/auth/logout/` | Logout user |
| GET | `/api/v1/auth/history/` | Get search history |
| GET | `/api/v1/auth/watchlist/` | Get watchlist |
| POST | `/api/v1/auth/watchlist/` | Add to watchlist |
| PATCH | `/api/v1/auth/watchlist/<id>/` | Update watchlist status |
| DELETE | `/api/v1/auth/watchlist/<id>/` | Remove from watchlist |

---

## ML Model

- **Algorithm:** Item-Based Collaborative Filtering
- **Technique:** Cosine Similarity
- **Dataset:** MovieLens Latest Small (100,836 ratings, 9,724 movies, 610 users)
- **Training:** Runs automatically in Docker. For manual setup run `python ml/train.py`
- **Note:** `model.pkl` is excluded from Git (721MB). Generated on first build.

---

## Project Structure

```
movie-recommender/
├── backend/
│   ├── api/          ← TMDB proxy + ML endpoints
│   ├── users/        ← auth + watchlist + history
│   ├── ml/           ← training + recommendation code
│   │   ├── train.py
│   │   ├── recommend.py
│   │   └── data/
│   │       ├── ratings.csv
│   │       └── movies.csv
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── api/
│   └── Dockerfile
├── nginx/
│   └── nginx.conf
├── docker-compose.yml
└── .env              ← create this manually (not in git)
```

---

## Notes

- Get a free TMDB API key at [themoviedb.org](https://themoviedb.org)
- `.env` is not included in the repo — create it manually using the template above
- `model.pkl` is not included — generated automatically by Docker or manually via `python ml/train.py`