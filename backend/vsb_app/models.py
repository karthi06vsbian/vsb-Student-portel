from django.db import models

class Department(models.Model):
    code = models.CharField(max_length=10, primary_key=True)
    name = models.CharField(max_length=100)
    hod_name = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return f"{self.code} - {self.name}"

class Teacher(models.Model):
    username = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    email = models.CharField(max_length=100)
    department = models.CharField(max_length=10) # Department Code
    role = models.CharField(max_length=50) # HOD, Class Advisor, etc.

    def __str__(self):
        return self.name

class Student(models.Model):
    register_number = models.CharField(max_length=50, primary_key=True)
    roll_number = models.CharField(max_length=50, null=True, blank=True)
    name = models.CharField(max_length=100)
    dob = models.CharField(max_length=20, null=True, blank=True)
    gender = models.CharField(max_length=20, null=True, blank=True)
    blood_group = models.CharField(max_length=10, null=True, blank=True)
    community = models.CharField(max_length=20, null=True, blank=True)
    religion = models.CharField(max_length=50, null=True, blank=True)
    caste = models.CharField(max_length=100, null=True, blank=True)
    nationality = models.CharField(max_length=50, null=True, blank=True)
    aadhaar = models.CharField(max_length=30, null=True, blank=True)
    raw_aadhaar = models.CharField(max_length=30, null=True, blank=True)
    residence = models.CharField(max_length=30, null=True, blank=True)
    hometown = models.CharField(max_length=100, null=True, blank=True)
    
    # Contact
    email = models.CharField(max_length=100, null=True, blank=True)
    alt_email = models.CharField(max_length=100, null=True, blank=True)
    phone = models.CharField(max_length=30, null=True, blank=True)
    emergency_contact = models.CharField(max_length=30, null=True, blank=True)
    address = models.TextField(null=True, blank=True)

    # Family
    parent_name = models.CharField(max_length=100, null=True, blank=True)
    parent_phone = models.CharField(max_length=30, null=True, blank=True)
    parent_occupation = models.CharField(max_length=100, null=True, blank=True)
    relation = models.CharField(max_length=50, null=True, blank=True)

    # Admission
    admission_number = models.CharField(max_length=50, null=True, blank=True)
    date_of_admission = models.CharField(max_length=20, null=True, blank=True)
    mode_of_admission = models.CharField(max_length=50, null=True, blank=True)
    admission_quota = models.CharField(max_length=50, null=True, blank=True)
    regulation = models.CharField(max_length=20, null=True, blank=True)
    emis_no = models.CharField(max_length=50, null=True, blank=True)
    tamil_medium = models.CharField(max_length=20, null=True, blank=True)
    physically_challenged = models.CharField(max_length=20, null=True, blank=True)

    # Academic
    sslc = models.CharField(max_length=100, null=True, blank=True)
    hsc = models.CharField(max_length=100, null=True, blank=True)
    diploma = models.CharField(max_length=100, null=True, blank=True)
    cgpa = models.CharField(max_length=20, null=True, blank=True)
    arrears = models.IntegerField(default=0)

    # Documents
    photo_doc = models.CharField(max_length=255, null=True, blank=True)
    resume_doc = models.CharField(max_length=255, null=True, blank=True)
    aadhaar_doc = models.CharField(max_length=255, null=True, blank=True)
    sslc_doc = models.CharField(max_length=255, null=True, blank=True)
    hsc_doc = models.CharField(max_length=255, null=True, blank=True)
    certificates_doc = models.CharField(max_length=255, null=True, blank=True)

    # Status / Meta
    approved = models.BooleanField(default=True)
    profile_completion = models.IntegerField(default=50)
    transport = models.CharField(max_length=100, null=True, blank=True)
    bus_route = models.CharField(max_length=255, null=True, blank=True)
    department = models.CharField(max_length=10, null=True, blank=True) # CSE, IT, etc.
    department_name = models.CharField(max_length=100, null=True, blank=True)
    batch = models.CharField(max_length=50, null=True, blank=True) # 2024-2028
    section = models.CharField(max_length=10, null=True, blank=True) # A, B
    year = models.IntegerField(default=1)

    # Professional Profiles / Skills
    skills = models.TextField(default='[]') # JSON array of skills
    languages = models.TextField(default='[]') # JSON array of languages
    internships = models.IntegerField(default=0)
    projects = models.IntegerField(default=0)
    hackathons = models.IntegerField(default=0)
    certificates = models.IntegerField(default=0)
    linkedin = models.CharField(max_length=255, null=True, blank=True)
    github = models.CharField(max_length=255, null=True, blank=True)
    leetcode = models.CharField(max_length=255, null=True, blank=True)

    # Placement
    placement_status = models.CharField(max_length=50, default='Not Applied')
    placement_company = models.CharField(max_length=100, null=True, blank=True)
    placement_package = models.CharField(max_length=50, null=True, blank=True)

    last_updated = models.CharField(max_length=50, default='Today')
    mysql_id = models.CharField(max_length=100, null=True, blank=True)
    created_time = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return f"{self.register_number} - {self.name}"
