import os
from django.db import models
from django.contrib.auth.models import User
from mutagen import File as MutagenFile

class Album(models.Model):
    title = models.CharField(max_length=255)
    artist = models.CharField(max_length=255)
    cover_art = models.ImageField(upload_to='album_covers/', null=True, blank=True)
    release_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.title} by {self.artist}"

class Song(models.Model):
    title = models.CharField(max_length=255, blank=True)
    album = models.ForeignKey(Album, related_name='songs', on_delete=models.CASCADE, null=True, blank=True)
    audio_file = models.FileField(upload_to='songs/')
    duration = models.CharField(max_length=10, help_text="e.g., 3:45", null=True, blank=True)
    upload_date = models.DateTimeField(auto_now_add=True)
    
    # --- NEW: MONETIZATION FIELDS ---
    is_free = models.BooleanField(default=True, help_text="Uncheck to make this a paid track")
    price = models.DecimalField(max_digits=6, decimal_places=2, default=0.00, help_text="Set price if not free (e.g., 1.99)")

    def save(self, *args, **kwargs):
        # 1. Save the file first so Mutagen has something to read
        super().save(*args, **kwargs)
        
        # 2. Open the newly saved file to extract data
        if self.audio_file:
            try:
                audio = MutagenFile(self.audio_file.path)
                update_needed = False
                
                if audio:
                    # Auto-extract duration and format as M:SS
                    if hasattr(audio.info, 'length') and not self.duration:
                        minutes = int(audio.info.length // 60)
                        seconds = int(audio.info.length % 60)
                        self.duration = f"{minutes}:{seconds:02d}"
                        update_needed = True
                    
                    # Auto-extract Title from ID3 tags (or fallback to filename)
                    tags = audio.tags if audio.tags else {}
                    if not self.title:
                        self.title = str(tags.get('TIT2', [os.path.basename(self.audio_file.name)])[0])
                        update_needed = True
                        
                # 3. If we found new data, update the database silently
                if update_needed:
                    Song.objects.filter(pk=self.pk).update(
                        title=self.title,
                        duration=self.duration
                    )
            except Exception as e:
                print(f"Error reading audio metadata: {e}")

    def __str__(self):
        return self.title or "Untitled Song"

class Playlist(models.Model):
    name = models.CharField(max_length=255)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    songs = models.ManyToManyField(Song, related_name='playlists', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

# --- NEW: PURCHASE TRACKING MODEL ---
class Purchase(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    song = models.ForeignKey(Song, on_delete=models.CASCADE)
    purchase_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Prevents a user from accidentally buying the same song twice
        unique_together = ('user', 'song') 

    def __str__(self):
        return f"{self.user.username} unlocked {self.song.title}"