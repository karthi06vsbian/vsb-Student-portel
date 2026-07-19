const pool = require('../config/db');

const Department = {
  async findAll() {
    const { rows } = await pool.query('SELECT * FROM departments ORDER BY name');
    return rows;
  },

  async create({ name, code }) {
    const { rows } = await pool.query(
      'INSERT INTO departments (name, code) VALUES ($1, $2) RETURNING *',
      [name, code]
    );
    return rows[0];
  },
};

module.exports = Department;
