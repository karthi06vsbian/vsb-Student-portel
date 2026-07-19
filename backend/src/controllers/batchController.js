const Batch = require('../models/batch.model');

exports.getByDepartment = async (req, res) => {
  try {
    const { departmentId } = req.query;
    if (!departmentId) {
      return res.status(400).json({ error: 'departmentId is required' });
    }
    const batches = await Batch.findByDepartment(departmentId);
    res.json(batches);
  } catch (err) {
    console.error('Get batches error:', err);
    res.status(500).json({ error: 'Failed to fetch batches' });
  }
};

exports.create = async (req, res) => {
  try {
    const { department_id, start_year, end_year } = req.body;
    if (!department_id || !start_year || !end_year) {
      return res.status(400).json({ error: 'department_id, start_year, and end_year are required' });
    }
    const batch = await Batch.create({
      department_id,
      start_year: parseInt(start_year, 10),
      end_year: parseInt(end_year, 10),
    });
    res.status(201).json(batch);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Batch already exists for this department' });
    }
    console.error('Create batch error:', err);
    res.status(500).json({ error: 'Failed to create batch' });
  }
};
