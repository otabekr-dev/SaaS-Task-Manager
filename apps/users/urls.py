from django.urls import path
from .views import RegisterView, LoginView, UserView, LogoutView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('me/', UserView.as_view(), name='user view'),
    path('refresh/', TokenRefreshView.as_view(), name='refresh')
]
