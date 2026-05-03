from django.http import JsonResponse
from . import tmdb
from ml.recommend import recommend as ml_recommend

# Create your views here.

def popular(request):
    movies = tmdb.get_popular()
    return JsonResponse({'results': movies})

def search(request):
    query = request.GET.get('q', '')
    if not query:
        return JsonResponse({'error': 'q is required'}, status=400)
    movies = tmdb.search_movies(query)
    return JsonResponse({'results': movies})

def movie_detail(request, tmdb_id):
    movie = tmdb.get_movie_details(tmdb_id)
    return JsonResponse(movie)

def recommend(request):
    title = request.GET.get('title', '')
    if not title:
        return JsonResponse({'error': 'title is required'}, status=400)

    recommended_titles = ml_recommend(title)

    if not recommended_titles:
        return JsonResponse({'results': []})

    results = []
    for t in recommended_titles:
        clean  = t.split('(')[0].strip()
        search = tmdb.search_movies(clean)
        if search:
            results.append(search[0])

    return JsonResponse({'results': results})