from django.contrib import admin
from django.utils.html import format_html
from unfold.admin import ModelAdmin
from .models import Album, Song, Playlist

@admin.register(Album)
class AlbumAdmin(ModelAdmin):
    list_display = ('title', 'get_cover_art', 'artist', 'release_date')
    search_fields = ('title', 'artist')

    def get_cover_art(self, obj):
        if obj.cover_art:
            return format_html(
                '<img src="{}" style="width: 40px; height: 40px; border-radius: 6px; object-fit: cover;" />', 
                obj.cover_art.url
            )
        return "-"
    get_cover_art.short_description = 'Cover Art'

@admin.register(Song)
class SongAdmin(ModelAdmin):
    list_display = ('title', 'get_album_cover', 'album', 'duration', 'audio_preview', 'upload_date')
    list_filter = ('album',)
    search_fields = ('title',)
    ordering = ('-upload_date',)

    def get_album_cover(self, obj):
        if obj.album and obj.album.cover_art:
            return format_html(
                '<img src="{}" style="width: 40px; height: 40px; border-radius: 6px; object-fit: cover;" />', 
                obj.album.cover_art.url
            )
        return "-"
    get_album_cover.short_description = 'Cover'

    def audio_preview(self, obj):
        if obj.audio_file:
            return format_html(
                '<audio controls preload="none" style="height: 35px; width: 220px; border-radius: 8px;">'
                '<source src="{}" type="audio/mpeg">'
                'Your browser does not support the audio element.'
                '</audio>',
                obj.audio_file.url
            )
        return "No File"
    audio_preview.short_description = 'Preview'

@admin.register(Playlist)
class PlaylistAdmin(ModelAdmin):
    list_display = ('name', 'owner', 'created_at')
    search_fields = ('name', 'owner__username')