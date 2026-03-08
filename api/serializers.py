from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Album, Song, Playlist, Purchase # <-- NEW: Import Purchase

# 1. Album Serializer
class AlbumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Album
        fields = '__all__'

# 2. Song Serializer (Using your awesome Nested logic!)
class SongSerializer(serializers.ModelSerializer):
    # This nests the album info inside the song, so React gets the cover art easily!
    album = AlbumSerializer(read_only=True) 
    
    # NEW: Custom field to check if the logged-in user bought the song
    has_purchased = serializers.SerializerMethodField()
    
    class Meta:
        model = Song
        # Explicitly listing fields so DRF includes our custom 'has_purchased' field alongside the new 'is_free' and 'price' fields
        fields = [
            'id', 
            'title', 
            'audio_file', 
            'duration', 
            'upload_date', 
            'album', 
            'is_free',    # <-- NEW
            'price',      # <-- NEW
            'has_purchased' # <-- NEW
        ]

    # NEW: Logic to check the Purchase table
    def get_has_purchased(self, obj):
        # Grab the request from the context
        request = self.context.get('request')
        
        # If a user is logged in, check if they own this specific song
        if request and request.user.is_authenticated:
            return Purchase.objects.filter(user=request.user, song=obj).exists()
            
        # If not logged in, they haven't bought it
        return False

# 3. Playlist Serializer
class PlaylistSerializer(serializers.ModelSerializer):
    songs = SongSerializer(many=True, read_only=True)
    
    class Meta:
        model = Playlist
        fields = '__all__'

# 4. Secure User Registration Serializer
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user