const pool = require('../config/db');

const LOCKED_FIELDS = [
  'admission_no', 'academic_level', 'programme_name', 'programme_code',
  'year_of_admission', 'mode_of_admission', 'admitted_semester',
  'admission_quota', 'date_of_admission', 'application_no',
  'dote_reference_no', 'doj', 'regulation', 'roll_number', 'student_name',
  'class_section', 'register_no',
];

const STUDENT_FILLABLE_FIELDS = [
  'gender', 'tamil_medium', 'blood_group', 'nationality', 'religion',
  'community', 'caste', 'physically_challenged', 'differently_abled',
  'tenth_board', 'tenth_marks', 'twelfth_board', 'twelfth_marks',
  'qualifying_exam_hsc', 'cutoff_hsc', 'year_of_passing_hsc',
  'diploma_percentage', 'diploma_programme', 'preceding_degree_year',
  'preceding_degree_percent', 'branch_studied',
  'parent_name', 'relation', 'parent_mobile', 'student_mobile',
  'door_no_street', 'town_taluk', 'city_district', 'state', 'country', 'pincode',
  'email_institution', 'email_alternate', 'aadhaar_number', 'emis_no',
  'boarding_status',
];

const ALL_STUDENT_FIELDS = [
  'register_no', 'dob', ...LOCKED_FIELDS.filter(f => f !== 'register_no'),
  ...STUDENT_FILLABLE_FIELDS,
];

const Student = {
  async findByRegisterNo(registerNo) {
    const { rows } = await pool.query(
      `SELECT s.*, sec.name AS section_name, b.start_year, b.end_year,
              d.name AS department_name, d.code AS department_code
       FROM students s
       JOIN sections sec ON s.section_id = sec.id
       JOIN batches b ON sec.batch_id = b.id
       JOIN departments d ON b.department_id = d.id
       WHERE s.register_no = $1`,
      [registerNo]
    );
    return rows[0];
  },

  async findById(id) {
    const { rows } = await pool.query(
      `SELECT s.*, sec.name AS section_name, b.start_year, b.end_year,
              d.name AS department_name, d.code AS department_code
       FROM students s
       JOIN sections sec ON s.section_id = sec.id
       JOIN batches b ON sec.batch_id = b.id
       JOIN departments d ON b.department_id = d.id
       WHERE s.id = $1`,
      [id]
    );
    return rows[0];
  },

  async findBySection(sectionId) {
    const { rows } = await pool.query(
      `SELECT s.*, sec.name AS section_name
       FROM students s
       JOIN sections sec ON s.section_id = sec.id
       WHERE s.section_id = $1
       ORDER BY s.register_no`,
      [sectionId]
    );
    return rows;
  },

  async create(data) {
    const baseFields = ['section_id', 'register_no', 'dob', 'password_hash', 'must_change_password'];
    const optionalFromData = [...LOCKED_FIELDS, ...STUDENT_FILLABLE_FIELDS]
      .filter(f => f !== 'register_no' && data[f] !== undefined);
    const allFields = [...baseFields, ...optionalFromData];

    const values = allFields.map((f) => {
      if (f === 'must_change_password') return data.must_change_password ?? true;
      return data[f];
    });
    const placeholders = allFields.map((_, i) => `$${i + 1}`).join(', ');

    const { rows } = await pool.query(
      `INSERT INTO students (${allFields.join(', ')}) VALUES (${placeholders}) RETURNING *`,
      values
    );
    return rows[0];
  },

  async update(id, data, { fillableOnly = false } = {}) {
    const allowed = fillableOnly
      ? STUDENT_FILLABLE_FIELDS
      : [...LOCKED_FIELDS, ...STUDENT_FILLABLE_FIELDS];
    const updates = [];
    const values = [];
    let idx = 1;

    for (const field of allowed) {
      if (data[field] !== undefined) {
        updates.push(`${field} = $${idx++}`);
        values.push(data[field]);
      }
    }

    if (data.profile_completed !== undefined && fillableOnly) {
      updates.push(`profile_completed = $${idx++}`);
      values.push(data.profile_completed);
    }

    if (updates.length === 0) return this.findById(id);

    updates.push('updated_at = NOW()');
    values.push(id);

    const { rows } = await pool.query(
      `UPDATE students SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );
    return rows[0];
  },

  async updatePassword(id, passwordHash) {
    const { rows } = await pool.query(
      'UPDATE students SET password_hash = $1, must_change_password = false WHERE id = $2 RETURNING *',
      [passwordHash, id]
    );
    return rows[0];
  },

  async delete(id) {
    const { rowCount } = await pool.query('DELETE FROM students WHERE id = $1', [id]);
    return rowCount > 0;
  },
};

module.exports = {
  Student,
  LOCKED_FIELDS,
  STUDENT_FILLABLE_FIELDS,
  ALL_STUDENT_FIELDS,
};
