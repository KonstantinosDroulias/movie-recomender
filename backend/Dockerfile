FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --upgrade certifi

COPY . .

RUN python ml/train.py

EXPOSE 8000

CMD sh -c "python manage.py migrate && gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 2"