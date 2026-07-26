import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import Department, Teacher, Student

def serialize_student(s):
    return {
        'registerNumber': s.register_number,
        'rollNumber': s.roll_number,
        'name': s.name,
        'dob': s.dob,
        'gender': s.gender,
        'bloodGroup': s.blood_group,
        'community': s.community,
        'religion': s.religion,
        'caste': s.caste,
        'nationality': s.nationality,
        'aadhaar': s.aadhaar,
        'rawAadhaar': s.raw_aadhaar,
        'residence': s.residence,
        'hometown': s.hometown,
        'email': s.email,
        'altEmail': s.alt_email,
        'phone': s.phone,
        'emergencyContact': s.emergency_contact,
        'address': s.address,
        'parentName': s.parent_name,
        'parentPhone': s.parent_phone,
        'parentOccupation': s.parent_occupation,
        'relation': s.relation,
        'admissionNumber': s.admission_number,
        'dateOfAdmission': s.date_of_admission,
        'modeOfAdmission': s.mode_of_admission,
        'admissionQuota': s.admission_quota,
        'regulation': s.regulation,
        'emisNo': s.emis_no,
        'tamilMedium': s.tamil_medium,
        'physicallyChallenged': s.physically_challenged,
        'sslc': s.sslc,
        'hsc': s.hsc,
        'diploma': s.diploma,
        'cgpa': s.cgpa,
        'arrears': s.arrears,
        'photoDoc': s.photo_doc,
        'resumeDoc': s.resume_doc,
        'aadhaarDoc': s.aadhaar_doc,
        'sslcDoc': s.sslc_doc,
        'hscDoc': s.hsc_doc,
        'certificatesDoc': s.certificates_doc,
        'approved': s.approved,
        'profileCompletion': s.profile_completion,
        'transport': s.transport,
        'busRoute': s.bus_route,
        'department': s.department,
        'departmentName': s.department_name,
        'batch': s.batch,
        'section': s.section,
        'year': s.year,
        'skills': json.loads(s.skills or '[]'),
        'languages': json.loads(s.languages or '[]'),
        'internships': s.internships,
        'projects': s.projects,
        'hackathons': s.hackathons,
        'certificates': s.certificates,
        'linkedin': s.linkedin,
        'github': s.github,
        'leetcode': s.leetcode,
        'placement': {
            'status': s.placement_status,
            'company': s.placement_company,
            'package': s.placement_package
        },
        'lastUpdated': s.last_updated,
        'mysqlId': s.mysql_id,
        'createdTime': s.created_time
    }

def serialize_teacher(t):
    return {
        'id': t.id,
        'username': t.username,
        'name': t.name,
        'email': t.email,
        'department': t.department,
        'role': t.role
    }

@csrf_exempt
@require_http_methods(["POST"])
def student_login(request):
    try:
        data = json.loads(request.body)
        username = StringVal = data.get('username', '').strip()
        dob = data.get('dob', '').strip()
        
        # Search by Register Number or Roll Number
        student = Student.objects.filter(register_number=username, dob=dob).first()
        if not student:
            student = Student.objects.filter(roll_number=username, dob=dob).first()
            
        if not student:
            return JsonResponse({'error': 'Invalid register number/roll number or DOB'}, status=400)
            
        return JsonResponse({'student': serialize_student(student)})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def teacher_login(request):
    try:
        data = json.loads(request.body)
        username = data.get('username', '').strip()
        # Password check is mocked in frontend, we just authenticate teacher record
        teacher = Teacher.objects.filter(username=username).first()
        if not teacher:
            # Create a mock faculty if not exists to facilitate testing
            teacher = Teacher.objects.create(
                username=username,
                name=username.replace('.', ' ').title(),
                email=f"{username}@vsb.edu.in",
                department="CSE",
                role="Faculty Advisor"
            )
        return JsonResponse({'teacher': serialize_teacher(teacher)})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def admin_login(request):
    try:
        data = json.loads(request.body)
        username = data.get('username', '').strip()
        password = data.get('password', '').strip()
        if username == 'admin' and password == 'admin':
            return JsonResponse({'success': True, 'role': 'admin'})
        return JsonResponse({'error': 'Invalid credentials'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["GET", "PUT"])
def student_detail(request, reg_num):
    try:
        student = Student.objects.filter(register_number=reg_num).first()
        if not student:
            return JsonResponse({'error': 'Student not found'}, status=404)

        if request.method == "GET":
            return JsonResponse({'student': serialize_student(student)})
            
        elif request.method == "PUT":
            data = json.loads(request.body)
            # Update fields
            student.name = data.get('name', student.name)
            student.dob = data.get('dob', student.dob)
            student.gender = data.get('gender', student.gender)
            student.blood_group = data.get('bloodGroup', student.blood_group)
            student.community = data.get('community', student.community)
            student.religion = data.get('religion', student.religion)
            student.caste = data.get('caste', student.caste)
            student.nationality = data.get('nationality', student.nationality)
            student.aadhaar = data.get('aadhaar', student.aadhaar)
            student.raw_aadhaar = data.get('rawAadhaar', student.raw_aadhaar)
            student.residence = data.get('residence', student.residence)
            student.hometown = data.get('hometown', student.hometown)
            student.email = data.get('email', student.email)
            student.alt_email = data.get('altEmail', student.alt_email)
            student.phone = data.get('phone', student.phone)
            student.emergency_contact = data.get('emergencyContact', student.emergency_contact)
            student.address = data.get('address', student.address)
            student.parent_name = data.get('parentName', student.parent_name)
            student.parent_phone = data.get('parentPhone', student.parent_phone)
            student.parent_occupation = data.get('parentOccupation', student.parent_occupation)
            student.relation = data.get('relation', student.relation)
            student.admission_number = data.get('admissionNumber', student.admission_number)
            student.date_of_admission = data.get('dateOfAdmission', student.date_of_admission)
            student.mode_of_admission = data.get('modeOfAdmission', student.mode_of_admission)
            student.admission_quota = data.get('admissionQuota', student.admission_quota)
            student.regulation = data.get('regulation', student.regulation)
            student.emis_no = data.get('emisNo', student.emis_no)
            student.tamil_medium = data.get('tamilMedium', student.tamil_medium)
            student.physically_challenged = data.get('physicallyChallenged', student.physically_challenged)
            student.sslc = data.get('sslc', student.sslc)
            student.hsc = data.get('hsc', student.hsc)
            student.diploma = data.get('diploma', student.diploma)
            student.cgpa = data.get('cgpa', student.cgpa)
            student.arrears = data.get('arrears', student.arrears)
            student.photo_doc = data.get('photoDoc', student.photo_doc)
            student.resume_doc = data.get('resumeDoc', student.resume_doc)
            student.aadhaar_doc = data.get('aadhaarDoc', student.aadhaar_doc)
            student.sslc_doc = data.get('sslcDoc', student.sslc_doc)
            student.hsc_doc = data.get('hscDoc', student.hsc_doc)
            student.certificates_doc = data.get('certificatesDoc', student.certificates_doc)
            student.approved = data.get('approved', student.approved)
            student.profile_completion = data.get('profileCompletion', student.profile_completion)
            student.transport = data.get('transport', student.transport)
            student.bus_route = data.get('busRoute', student.bus_route)
            student.department = data.get('department', student.department)
            student.department_name = data.get('departmentName', student.department_name)
            student.batch = data.get('batch', student.batch)
            student.section = data.get('section', student.section)
            student.year = data.get('year', student.year)
            student.skills = json.dumps(data.get('skills', []))
            student.languages = json.dumps(data.get('languages', []))
            student.internships = data.get('internships', student.internships)
            student.projects = data.get('projects', student.projects)
            student.hackathons = data.get('hackathons', student.hackathons)
            student.certificates = data.get('certificates', student.certificates)
            student.linkedin = data.get('linkedin', student.linkedin)
            student.github = data.get('github', student.github)
            student.leetcode = data.get('leetcode', student.leetcode)
            
            placement = data.get('placement', {})
            student.placement_status = placement.get('status', student.placement_status)
            student.placement_company = placement.get('company', student.placement_company)
            student.placement_package = placement.get('package', student.placement_package)
            
            student.last_updated = data.get('lastUpdated', 'Just now')
            
            student.save()
            return JsonResponse({'success': True, 'student': serialize_student(student)})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def teacher_students(request):
    try:
        dept = request.GET.get('dept', '').strip()
        batch = request.GET.get('batch', '').strip()
        section = request.GET.get('section', '').strip()
        
        query = Student.objects.all()
        if dept and dept != 'ALL':
            query = query.filter(department=dept)
        if batch and batch != 'ALL':
            query = query.filter(batch=batch)
        if section and section != 'ALL':
            query = query.filter(section=section)
            
        students = [serialize_student(s) for s in query]
        return JsonResponse({'students': students})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def admin_all_students(request):
    try:
        students = [serialize_student(s) for s in Student.objects.all()]
        return JsonResponse({'students': students})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def admin_all_teachers(request):
    try:
        teachers = [serialize_teacher(t) for t in Teacher.objects.all()]
        return JsonResponse({'teachers': teachers})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def approve_student(request, reg_num):
    try:
        student = Student.objects.filter(register_number=reg_num).first()
        if not student:
            return JsonResponse({'error': 'Student not found'}, status=404)
        
        data = json.loads(request.body)
        student.approved = data.get('approved', True)
        student.save()
        return JsonResponse({'success': True, 'approved': student.approved})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def bulk_import(request):
    try:
        data = json.loads(request.body)
        student_list = data.get('students', [])
        created_count = 0
        updated_count = 0
        
        for item in student_list:
            reg_num = item.get('registerNumber')
            if not reg_num:
                continue
                
            placement = item.get('placement', {})
            skills_raw = json.dumps(item.get('skills', []))
            langs_raw = json.dumps(item.get('languages', []))
            
            student, created = Student.objects.update_or_create(
                register_number=reg_num,
                defaults={
                    'roll_number': item.get('rollNumber'),
                    'name': item.get('name'),
                    'dob': item.get('dob'),
                    'gender': item.get('gender'),
                    'blood_group': item.get('bloodGroup'),
                    'community': item.get('community'),
                    'religion': item.get('religion'),
                    'caste': item.get('caste'),
                    'nationality': item.get('nationality'),
                    'aadhaar': item.get('aadhaar'),
                    'raw_aadhaar': item.get('rawAadhaar'),
                    'residence': item.get('residence'),
                    'hometown': item.get('hometown'),
                    'email': item.get('email'),
                    'alt_email': item.get('altEmail'),
                    'phone': item.get('phone'),
                    'emergency_contact': item.get('emergencyContact'),
                    'address': item.get('address'),
                    'parent_name': item.get('parentName'),
                    'parent_phone': item.get('parentPhone'),
                    'parent_occupation': item.get('parentOccupation'),
                    'relation': item.get('relation'),
                    'admission_number': item.get('admissionNumber'),
                    'date_of_admission': item.get('dateOfAdmission'),
                    'mode_of_admission': item.get('modeOfAdmission'),
                    'admission_quota': item.get('admissionQuota'),
                    'regulation': item.get('regulation'),
                    'emis_no': item.get('emisNo'),
                    'tamil_medium': item.get('tamilMedium'),
                    'physically_challenged': item.get('physicallyChallenged'),
                    'sslc': item.get('sslc'),
                    'hsc': item.get('hsc'),
                    'diploma': item.get('diploma'),
                    'cgpa': item.get('cgpa'),
                    'arrears': item.get('arrears', 0),
                    'photo_doc': item.get('photoDoc'),
                    'resume_doc': item.get('resumeDoc'),
                    'aadhaar_doc': item.get('aadhaarDoc'),
                    'sslc_doc': item.get('sslcDoc'),
                    'hsc_doc': item.get('hscDoc'),
                    'certificates_doc': item.get('certificatesDoc'),
                    'approved': item.get('approved', True),
                    'profile_completion': item.get('profileCompletion', 50),
                    'transport': item.get('transport'),
                    'bus_route': item.get('busRoute'),
                    'department': item.get('department'),
                    'department_name': item.get('departmentName'),
                    'batch': item.get('batch'),
                    'section': item.get('section'),
                    'year': item.get('year', 1),
                    'skills': skills_raw,
                    'languages': langs_raw,
                    'internships': item.get('internships', 0),
                    'projects': item.get('projects', 0),
                    'hackathons': item.get('hackathons', 0),
                    'certificates': item.get('certificates', 0),
                    'linkedin': item.get('linkedin'),
                    'github': item.get('github'),
                    'leetcode': item.get('leetcode'),
                    'placement_status': placement.get('status', 'Not Applied'),
                    'placement_company': placement.get('company'),
                    'placement_package': placement.get('package'),
                    'last_updated': item.get('lastUpdated', 'Today'),
                    'mysql_id': item.get('mysqlId'),
                    'created_time': item.get('createdTime')
                }
            )
            if created:
                created_count += 1
            else:
                updated_count += 1
                
        return JsonResponse({'success': True, 'created': created_count, 'updated': updated_count})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def sync_initial_data(request):
    try:
        data = json.loads(request.body)
        students = data.get('students', [])
        teachers = data.get('teachers', [])
        
        # Seed teachers
        for t in teachers:
            Teacher.objects.get_or_create(
                username=t.get('username'),
                defaults={
                    'name': t.get('name'),
                    'email': t.get('email'),
                    'department': t.get('department', 'CSE'),
                    'role': t.get('role', 'Faculty Advisor')
                }
            )
            
        # Seed students
        for s in students:
            placement = s.get('placement', {})
            Student.objects.get_or_create(
                register_number=s.get('registerNumber'),
                defaults={
                    'roll_number': s.get('rollNumber'),
                    'name': s.get('name'),
                    'dob': s.get('dob'),
                    'gender': s.get('gender'),
                    'blood_group': s.get('bloodGroup'),
                    'community': s.get('community'),
                    'hometown': s.get('hometown'),
                    'address': s.get('address'),
                    'aadhaar': s.get('aadhaar'),
                    'raw_aadhaar': s.get('rawAadhaar'),
                    'sslc': s.get('sslc'),
                    'hsc': s.get('hsc'),
                    'diploma': s.get('diploma'),
                    'cgpa': s.get('cgpa'),
                    'arrears': s.get('arrears', 0),
                    'skills': json.dumps(s.get('skills', [])),
                    'languages': json.dumps(s.get('languages', [])),
                    'internships': s.get('internships', 0),
                    'projects': s.get('projects', 0),
                    'hackathons': s.get('hackathons', 0),
                    'certificates': s.get('certificates', 0),
                    'linkedin': s.get('linkedin'),
                    'github': s.get('github'),
                    'leetcode': s.get('leetcode'),
                    'placement_status': placement.get('status', 'Not Applied'),
                    'placement_company': placement.get('company'),
                    'placement_package': placement.get('package'),
                    'transport': s.get('transport'),
                    'residence': s.get('residence'),
                    'emergency_contact': s.get('emergencyContact'),
                    'parent_name': s.get('parentName'),
                    'parent_phone': s.get('parentPhone'),
                    'parent_occupation': s.get('parentOccupation'),
                    'photo_doc': s.get('photoDoc'),
                    'resume_doc': s.get('resumeDoc'),
                    'aadhaar_doc': s.get('aadhaarDoc'),
                    'sslc_doc': s.get('sslcDoc'),
                    'hsc_doc': s.get('hscDoc'),
                    'certificates_doc': s.get('certificatesDoc'),
                    'profile_completion': s.get('profileCompletion', 50),
                    'approved': s.get('approved', True),
                    'last_updated': s.get('lastUpdated', 'Today'),
                    'department': s.get('department'),
                    'department_name': s.get('departmentName'),
                    'batch': s.get('batch'),
                    'section': s.get('section'),
                    'year': s.get('year', 1)
                }
            )
        return JsonResponse({'success': True, 'msg': 'Sync successful'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
