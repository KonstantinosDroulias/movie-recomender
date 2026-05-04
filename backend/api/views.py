from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from . import tmdb
from ml.recommend import recommend as ml_recommend


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


@api_view(['GET'])
def recommend(request):
    title = request.GET.get('title', '')
    if not title:
        return Response({'error': 'title is required'}, status=400)

    recommended_titles = ml_recommend(title)

    if not recommended_titles:
        return Response({'results': []})

    results = []
    for t in recommended_titles:
        clean = t.split('(')[0].strip()
        found = tmdb.search_movies(clean)
        if found:
            results.append(found[0])

    if request.user.is_authenticated:
        from users.models import SearchHistory
        SearchHistory.objects.create(
            user           = request.user,
            searched_movie = title,
            recommended    = [r.get('title') for r in results]
        )

    return Response({'results': results})