from rest_framework import viewsets, filters, permissions, generics
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth.models import User
from .models import Album, Song, Playlist, Purchase # <-- NEW: Added Purchase model
from .serializers import AlbumSerializer, SongSerializer, PlaylistSerializer, RegisterSerializer

# <-- NEW: Imports for the custom purchase view
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

# 1. Album ViewSet
class AlbumViewSet(viewsets.ModelViewSet):
    queryset = Album.objects.all()
    serializer_class = AlbumSerializer
    # SECURITY: Guests can view, but only logged-in users can Add/Edit/Delete
    permission_classes = [permissions.IsAuthenticatedOrReadOnly] 
    
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['artist', 'release_date']
    search_fields = ['title', 'artist']
    ordering_fields = ['title', 'release_date']

# 2. Song ViewSet
class SongViewSet(viewsets.ModelViewSet):
    queryset = Song.objects.all().order_by('-upload_date')
    serializer_class = SongSerializer
    # SECURITY: Guests can view, but only logged-in users can Add/Edit/Delete
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['album'] 
    search_fields = ['title', 'album__title', 'album__artist']
    ordering_fields = ['upload_date', 'title']

# 3. Playlist ViewSet
class PlaylistViewSet(viewsets.ModelViewSet):
    queryset = Playlist.objects.all()
    serializer_class = PlaylistSerializer
    # SECURITY: Guests can view, but only logged-in users can Add/Edit/Delete
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['owner']
    search_fields = ['name']

# 4. Secure Registration View
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    # SECURITY: We explicitly allow anyone to access this so they can sign up!
    permission_classes = (permissions.AllowAny,) 
    serializer_class = RegisterSerializer

# 5. --- NEW: SECURE PURCHASE ENDPOINT ---
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated]) # SECURITY: Only logged-in users can buy
def purchase_song(request):
    song_id = request.data.get('song_id')
    song = get_object_or_404(Song, id=song_id)

    # Check if the user already owns it to prevent double-charging
    if Purchase.objects.filter(user=request.user, song=song).exists():
        return Response({"error": "You already own this track."}, status=400)

    # Create the official purchase record in the database
    Purchase.objects.create(user=request.user, song=song)

    return Response({"success": "Track unlocked successfully!"}, status=201)