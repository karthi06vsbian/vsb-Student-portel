const XLSX = require('xlsx');

const COLUMN_MAP = {
  RegisterNo: 'register_no',
  RegisterNumber: 'register_no',
  Register: 'register_no',
  register_no: 'register_no',
  Password: 'password',
  password: 'password',
  DateOfBirth: 'dob',
  DOB: 'dob',
  dob: 'dob',
  AdmissionNo: 'admission_no',
  AdmnNo: 'admission_no',
  admission_no: 'admission_no',
  UG: 'academic_level',
  AcademicLevel: 'academic_level',
  academic_level: 'academic_level',
  ProgrammeName: 'programme_name',
  programme_name: 'programme_name',
  ProgrammeCode: 'programme_code',
  programme_code: 'programme_code',
  YearOfAdmission: 'year_of_admission',
  year_of_admission: 'year_of_admission',
  ModeOfAdmission: 'mode_of_admission',
  mode_of_admission: 'mode_of_admission',
  AdmittedSemester: 'admitted_semester',
  admitted_semester: 'admitted_semester',
  AdmissionQuota: 'admission_quota',
  admission_quota: 'admission_quota',
  DateOfAdmission: 'date_of_admission',
  date_of_admission: 'date_of_admission',
  ApplicationNo: 'application_no',
  application_no: 'application_no',
  DOTEReferenceNo: 'dote_reference_no',
  dote_reference_no: 'dote_reference_no',
  DOJ: 'doj',
  doj: 'doj',
  Regulation: 'regulation',
  regulation: 'regulation',
  RollNumber: 'roll_number',
  roll_number: 'roll_number',
  StudentName: 'student_name',
  student_name: 'student_name',
  Section: 'class_section',
  class_section: 'class_section',
  Gender: 'gender',
  gender: 'gender',
  TamilMedium: 'tamil_medium',
  tamil_medium: 'tamil_medium',
  BloodGroup: 'blood_group',
  blood_group: 'blood_group',
  Nationality: 'nationality',
  nationality: 'nationality',
  Religion: 'religion',
  religion: 'religion',
  Community: 'community',
  community: 'community',
  Caste: 'caste',
  caste: 'caste',
  PhysicallyChallenged: 'physically_challenged',
  physically_challenged: 'physically_challenged',
  DifferentlyAbled: 'differently_abled',
  differently_abled: 'differently_abled',
  TenthBoard: 'tenth_board',
  tenth_board: 'tenth_board',
  TenthMarks: 'tenth_marks',
  tenth_marks: 'tenth_marks',
  TwelfthBoard: 'twelfth_board',
  twelfth_board: 'twelfth_board',
  QualifyingExamHSC: 'qualifying_exam_hsc',
  qualifying_exam_hsc: 'qualifying_exam_hsc',
  TwelfthMarks: 'twelfth_marks',
  twelfth_marks: 'twelfth_marks',
  CutoffHSC: 'cutoff_hsc',
  cutoff_hsc: 'cutoff_hsc',
  YearOfPassingHSC: 'year_of_passing_hsc',
  year_of_passing_hsc: 'year_of_passing_hsc',
  DiplomaPercentage: 'diploma_percentage',
  diploma_percentage: 'diploma_percentage',
  DiplomaProgramme: 'diploma_programme',
  diploma_programme: 'diploma_programme',
  PrecedingDegreeYear: 'preceding_degree_year',
  preceding_degree_year: 'preceding_degree_year',
  PrecedingDegreePercent: 'preceding_degree_percent',
  preceding_degree_percent: 'preceding_degree_percent',
  BranchStudied: 'branch_studied',
  branch_studied: 'branch_studied',
  ParentName: 'parent_name',
  parent_name: 'parent_name',
  Relation: 'relation',
  relation: 'relation',
  ParentMobile: 'parent_mobile',
  parent_mobile: 'parent_mobile',
  StudentMobile: 'student_mobile',
  student_mobile: 'student_mobile',
  DoorNoStreet: 'door_no_street',
  door_no_street: 'door_no_street',
  TownTaluk: 'town_taluk',
  town_taluk: 'town_taluk',
  CityDistrict: 'city_district',
  city_district: 'city_district',
  State: 'state',
  state: 'state',
  Country: 'country',
  country: 'country',
  Pincode: 'pincode',
  pincode: 'pincode',
  EmailInstitution: 'email_institution',
  email_institution: 'email_institution',
  EmailAlternate: 'email_alternate',
  email_alternate: 'email_alternate',
  AadhaarNumber: 'aadhaar_number',
  aadhaar_number: 'aadhaar_number',
  EMISNo: 'emis_no',
  emis_no: 'emis_no',
  BoardingStatus: 'boarding_status',
  boarding_status: 'boarding_status',
};

const NORMALIZED_COLUMN_MAP = Object.fromEntries(
  Object.entries(COLUMN_MAP).map(([key, value]) => [normalizeColumnName(key), value])
);

const EXPORT_COLUMNS = [
  'RegisterNo', 'Password', 'DOB', 'AdmissionNo', 'UG', 'ProgrammeName', 'ProgrammeCode',
  'YearOfAdmission', 'ModeOfAdmission', 'AdmittedSemester', 'AdmissionQuota',
  'DateOfAdmission', 'ApplicationNo', 'DOTEReferenceNo', 'DOJ', 'Regulation',
  'RollNumber', 'StudentName', 'Section', 'Gender', 'TamilMedium', 'BloodGroup',
  'Nationality', 'Religion', 'Community', 'Caste', 'PhysicallyChallenged', 'DifferentlyAbled',
  'TenthBoard', 'TenthMarks', 'TwelfthBoard', 'QualifyingExamHSC', 'TwelfthMarks', 'CutoffHSC',
  'YearOfPassingHSC', 'DiplomaPercentage', 'DiplomaProgramme', 'PrecedingDegreeYear',
  'PrecedingDegreePercent', 'BranchStudied', 'ParentName', 'Relation', 'ParentMobile',
  'StudentMobile', 'DoorNoStreet', 'TownTaluk', 'CityDistrict', 'State', 'Country',
  'Pincode', 'EmailInstitution', 'EmailAlternate', 'AadhaarNumber', 'EMISNo',
  'BoardingStatus', 'ProfileCompleted',
];

function xlsxDateToJS(serial) {
  const utcDays = Math.floor(serial - 25569);
  const utcValue = utcDays * 86400;
  return new Date(utcValue * 1000);
}

function normalizeColumnName(value) {
  return String(value).trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

function parseExcelRows(row) {
  const parsed = {};

  for (const [key, value] of Object.entries(row)) {
    const dbField = COLUMN_MAP[key.trim()] || NORMALIZED_COLUMN_MAP[normalizeColumnName(key)];
    if (dbField) {
      let val = value;
      if (['dob', 'date_of_admission', 'doj'].includes(dbField) && val) {
        if (typeof val === 'number') {
          val = xlsxDateToJS(val).toISOString().slice(0, 10);
        } else if (val instanceof Date) {
          val = val.toISOString().slice(0, 10);
        } else {
          val = String(val).slice(0, 10);
        }
      }
      if (['physically_challenged', 'differently_abled', 'tamil_medium'].includes(dbField)) {
        val = val === true || val === 'true' || val === 'Yes' || val === 'Y' || val === 1;
      }
      if (['year_of_admission', 'year_of_passing_hsc', 'preceding_degree_year'].includes(dbField) && val) {
        val = parseInt(val, 10) || null;
      }
      parsed[dbField] = val === '' ? null : val;
    }
  }

  return parsed;
}

function buildExportRows(students) {
  return students.map((s) => {
    const row = {};
    for (const col of EXPORT_COLUMNS) {
      if (col === 'Password') {
        row[col] = '';
        continue;
      }
      if (col === 'ProfileCompleted') {
        row[col] = s.profile_completed ? 'Yes' : 'No';
        continue;
      }

      const dbField = COLUMN_MAP[col];
      if (dbField && s[dbField] !== undefined) {
        let val = s[dbField];
        if (['dob', 'date_of_admission', 'doj'].includes(dbField) && val) {
          val = new Date(val).toISOString().slice(0, 10);
        }
        if (typeof val === 'boolean') {
          val = val ? 'Yes' : 'No';
        }
        row[col] = val ?? '';
      } else {
        row[col] = '';
      }
    }
    return row;
  });
}

module.exports = { parseExcelRows, buildExportRows, COLUMN_MAP, EXPORT_COLUMNS };
