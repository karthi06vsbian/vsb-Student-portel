from django.contrib import admin
from django.urls import path, include
from vsb_app.views import root_api_view

urlpatterns = [
    path('', root_api_view, name='root'),
    path('admin/', admin.site.urls),
    path('api/', include('vsb_app.urls')),
]
