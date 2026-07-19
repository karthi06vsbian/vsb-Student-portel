const pool = require('../config/db');

const Batch = {
  async findByDepartment(departmentId) {
    const { rows } = await pool.query(
      'SELECT * FROM batches WHERE department_id = $1 ORDER BY start_year DESC',
      [departmentId]
    );
    return rows;
  },

  async create({ department_id, start_year, end_year }) {
    const { rows } = await pool.query(
      'INSERT INTO batches (department_id, start_year, end_year) VALUES ($1, $2, $3) RETURNING *',
      [department_id, start_year, end_year]
    );
    return rows[0];
  },
};

module.exports = Batch;
