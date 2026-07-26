from django.urls import path
from . import views

urlpatterns = [
    path('login/student/', views.student_login, name='student_login'),
    path('login/teacher/', views.teacher_login, name='teacher_login'),
    path('login/admin/', views.admin_login, name='admin_login'),
    
    path('students/', views.teacher_students, name='teacher_students'),
    path('students/all/', views.admin_all_students, name='admin_all_students'),
    path('students/bulk-import/', views.bulk_import, name='bulk_import'),
    path('students/sync-initial/', views.sync_initial_data, name='sync_initial_data'),
    path('students/<str:reg_num>/approve/', views.approve_student, name='approve_student'),
    path('students/<str:reg_num>/', views.student_detail, name='student_detail'),
    
    path('teachers/all/', views.admin_all_teachers, name='admin_all_teachers'),
]
