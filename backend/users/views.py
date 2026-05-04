from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from .models import SearchHistory, Watchlist

# Create your views here.
@api_view(['POST'])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email    = request.data.get('email', '')

    if not username or not password:
        return Response(
            {'error': 'Username and password required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {'error': 'Username already taken'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user  = User.objects.create_user(
                username=username,
                password=password,
                email=email
            )
    token = Token.objects.create(user=user)

    return Response({
        'token':    token.key,
        'username': user.username,
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)

    if not user:
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    token, _ = Token.objects.get_or_create(user=user)

    return Response({
        'token':    token.key,
        'username': user.username,
    })


@api_view(['POST'])
def logout(request):
    if request.user.is_authenticated:
        request.user.auth_token.delete()
    return Response({'message': 'Logged out'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def history(request):
    searches = SearchHistory.objects.filter(
        user=request.user
    )[:20]

    return Response([{
        'id':             s.id,
        'searched_movie': s.searched_movie,
        'recommended':    s.recommended,
        'searched_at':    s.searched_at,
    } for s in searches])

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def watchlist(request):

    # READ — get all watchlist items
    if request.method == 'GET':
        items = Watchlist.objects.filter(user=request.user)
        return Response([{
            'id':          item.id,
            'tmdb_id':     item.tmdb_id,
            'title':       item.title,
            'poster_path': item.poster_path,
            'status':      item.status,
            'added_at':    item.added_at,
        } for item in items])

    # CREATE — add movie to watchlist
    if request.method == 'POST':
        tmdb_id     = request.data.get('tmdb_id')
        title       = request.data.get('title')
        poster_path = request.data.get('poster_path', '')

        if not tmdb_id or not title:
            return Response(
                {'error': 'tmdb_id and title required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        item, created = Watchlist.objects.get_or_create(
            user=request.user,
            tmdb_id=tmdb_id,
            defaults={
                'title':       title,
                'poster_path': poster_path,
                'status':      'want_to_watch',
            }
        )

        if not created:
            return Response(
                {'error': 'Movie already in watchlist'},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response({
            'id':      item.id,
            'title':   item.title,
            'status':  item.status,
        }, status=status.HTTP_201_CREATED)


@api_view(['PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def watchlist_item(request, item_id):

    try:
        item = Watchlist.objects.get(
            id=item_id,
            user=request.user
        )
    except Watchlist.DoesNotExist:
        return Response(
            {'error': 'Not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    # UPDATE — change status
    if request.method == 'PATCH':
        new_status = request.data.get('status')

        valid = ['want_to_watch', 'watching', 'watched']
        if new_status not in valid:
            return Response(
                {'error': f'Status must be one of {valid}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        item.status = new_status
        item.save()

        return Response({
            'id':     item.id,
            'title':  item.title,
            'status': item.status,
        })

    # DELETE — remove from watchlist
    if request.method == 'DELETE':
        item.delete()
        return Response(
            {'message': f'{item.title} removed from watchlist'},
            status=status.HTTP_204_NO_CONTENT
        )