from django.urls import path, include
from rest_framework.routers import DefaultRouter
# <-- 1. Import RegisterView AND purchase_song
from .views import AlbumViewSet, SongViewSet, PlaylistViewSet, RegisterView, purchase_song 

# This automatically creates all your API endpoints for React
router = DefaultRouter()
router.register(r'albums', AlbumViewSet)
router.register(r'songs', SongViewSet)
router.register(r'playlists', PlaylistViewSet)

urlpatterns = [
    path('', include(router.urls)),
    
    # --- 2. SECURE SIGN UP ENDPOINT ---
    path('register/', RegisterView.as_view(), name='auth_register'), 
    
    # --- 3. SECURE PURCHASE ENDPOINT ---
    path('purchase/', purchase_song, name='purchase-song'),
]