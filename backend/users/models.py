from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class SearchHistory(models.Model):
    user            = models.ForeignKey(
                        User,
                        on_delete=models.CASCADE,
                        related_name='searches'
                      )
    searched_movie  = models.CharField(max_length=255)
    recommended     = models.JSONField(default=list)
    searched_at     = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-searched_at']

    def __str__(self):
        return f'{self.user.username} searched {self.searched_movie}'


class Watchlist(models.Model):
    STATUS_CHOICES = [
        ('want_to_watch', 'Want to Watch'),
        ('watching',      'Watching'),
        ('watched',       'Watched'),
    ]

    user         = models.ForeignKey(
                     User,
                     on_delete=models.CASCADE,
                     related_name='watchlist'
                   )
    tmdb_id      = models.IntegerField()
    title        = models.CharField(max_length=255)
    poster_path  = models.CharField(max_length=255, blank=True)
    status       = models.CharField(
                     max_length=20,
                     choices=STATUS_CHOICES,
                     default='want_to_watch'
                   )
    added_at     = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['user', 'tmdb_id']
        ordering        = ['-added_at']

    def __str__(self):
        return f'{self.user.username} — {self.title} — {self.status}'