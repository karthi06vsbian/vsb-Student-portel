export const INSTITUTIONAL_FIELDS = [
  { key: 'register_no', label: 'Register No', required: true },
  { key: 'student_name', label: 'Student Name' },
  { key: 'roll_number', label: 'Roll Number' },
  { key: 'admission_no', label: 'Admission No' },
  { key: 'academic_level', label: 'UG / PG' },
  { key: 'programme_name', label: 'Programme Name' },
  { key: 'programme_code', label: 'Programme Code' },
  { key: 'year_of_admission', label: 'Year of Admission', type: 'number' },
  { key: 'mode_of_admission', label: 'Mode of Admission' },
  { key: 'admitted_semester', label: 'Admitted Semester' },
  { key: 'admission_quota', label: 'Admission Quota' },
  { key: 'date_of_admission', label: 'Date of Admission', type: 'date' },
  { key: 'application_no', label: 'Application No' },
  { key: 'dote_reference_no', label: 'DOTE Reference No' },
  { key: 'doj', label: 'DOJ', type: 'date' },
  { key: 'regulation', label: 'Regulation' },
  { key: 'class_section', label: 'Class Section' },
  { key: 'section_name', label: 'Portal Section', readOnly: true },
  { key: 'department_name', label: 'Department', readOnly: true },
];

export const STUDENT_DETAIL_SECTIONS = [
  {
    title: 'Personal Details',
    fields: [
      { key: 'dob', label: 'DOB', type: 'date', required: true },
      { key: 'gender', label: 'Gender', type: 'select', options: ['M', 'F', 'T', 'Male', 'Female', 'Other'] },
      { key: 'tamil_medium', label: 'Tamil Medium', type: 'checkbox' },
      { key: 'blood_group', label: 'Blood Group' },
      { key: 'nationality', label: 'Nationality' },
      { key: 'religion', label: 'Religion' },
      { key: 'community', label: 'Community' },
      { key: 'caste', label: 'Caste' },
      { key: 'physically_challenged', label: 'Physically Challenged', type: 'checkbox' },
      { key: 'differently_abled', label: 'Differently Abled', type: 'checkbox' },
      { key: 'boarding_status', label: 'Boarding Status', type: 'select', options: ['0', '1', 'Dayscholar', 'Hosteller'] },
    ],
  },
  {
    title: 'Academic History',
    fields: [
      { key: 'tenth_board', label: '10th Board' },
      { key: 'tenth_marks', label: '10th Marks' },
      { key: 'twelfth_board', label: '12th Board' },
      { key: 'qualifying_exam_hsc', label: 'Qualifying Exam HSC' },
      { key: 'twelfth_marks', label: '12th Marks' },
      { key: 'cutoff_hsc', label: 'Cutoff HSC' },
      { key: 'year_of_passing_hsc', label: 'Year of Passing HSC', type: 'number' },
      { key: 'diploma_percentage', label: 'Diploma Percentage' },
      { key: 'diploma_programme', label: 'Diploma Programme' },
      { key: 'preceding_degree_year', label: 'Preceding Degree Year', type: 'number' },
      { key: 'preceding_degree_percent', label: 'Preceding Degree Percent' },
      { key: 'branch_studied', label: 'Branch Studied' },
    ],
  },
  {
    title: 'Family Details',
    fields: [
      { key: 'parent_name', label: 'Parent / Husband Name' },
      { key: 'relation', label: 'Relation' },
      { key: 'parent_mobile', label: 'Parent Mobile', type: 'tel' },
    ],
  },
  {
    title: 'Address',
    fields: [
      { key: 'door_no_street', label: 'Door No & Street' },
      { key: 'town_taluk', label: 'Town / Taluk' },
      { key: 'city_district', label: 'City / District' },
      { key: 'state', label: 'State' },
      { key: 'country', label: 'Country' },
      { key: 'pincode', label: 'Pincode' },
    ],
  },
  {
    title: 'Contact & IDs',
    fields: [
      { key: 'student_mobile', label: 'Student Mobile', type: 'tel' },
      { key: 'email_institution', label: 'Institution Email', type: 'email' },
      { key: 'email_alternate', label: 'Alternate Email', type: 'email' },
      { key: 'aadhaar_number', label: 'Aadhaar Number' },
      { key: 'emis_no', label: 'EMIS No' },
    ],
  },
];

export const TEACHER_STUDENT_FIELDS = [
  ...INSTITUTIONAL_FIELDS.filter((field) => !field.readOnly),
  ...STUDENT_DETAIL_SECTIONS.flatMap((section) => section.fields),
];
