const pool = require('../config/db');

const Section = {
  async findByBatch(batchId) {
    const { rows } = await pool.query(
      'SELECT * FROM sections WHERE batch_id = $1 ORDER BY name',
      [batchId]
    );
    return rows;
  },

  async create({ batch_id, name }) {
    const { rows } = await pool.query(
      'INSERT INTO sections (batch_id, name) VALUES ($1, $2) RETURNING *',
      [batch_id, name.toUpperCase()]
    );
    return rows[0];
  },
};

module.exports = Section;
