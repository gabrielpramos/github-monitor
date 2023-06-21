from django.urls import path

from .views import commit_list_view, repository_create_view, commit_list_create_view, repositories_list_view

app_name = 'repositories'

urlpatterns = [
    path('api/commits/', commit_list_view, name='commits-list'),
    path('api/commits/create/<repositoryName>', commit_list_create_view, name='commits-list-persist'),
    path('api/repositories/', repository_create_view, name='repositories-create'),
    path('api/repositories/list', repositories_list_view, name='repositories-list'),
]
