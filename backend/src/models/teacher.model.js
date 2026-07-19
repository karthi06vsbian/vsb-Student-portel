const pool = require('../config/db');

const Teacher = {
  async findByUsername(username) {
    const { rows } = await pool.query(
      'SELECT * FROM teachers WHERE username = $1',
      [username]
    );
    return rows[0];
  },

  async updatePassword(id, passwordHash) {
    const { rows } = await pool.query(
      'UPDATE teachers SET password_hash = $1, must_change_password = false WHERE id = $2 RETURNING id, username, name, must_change_password',
      [passwordHash, id]
    );
    return rows[0];
  },
};

module.exports = Teacher;
