const Department = require('../models/department.model');

exports.getAll = async (_req, res) => {
  try {
    const departments = await Department.findAll();
    res.json(departments);
  } catch (err) {
    console.error('Get departments error:', err);
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, code } = req.body;
    if (!name || !code) {
      return res.status(400).json({ error: 'Name and code are required' });
    }
    const department = await Department.create({ name, code: code.toUpperCase() });
    res.status(201).json(department);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Department code already exists' });
    }
    console.error('Create department error:', err);
    res.status(500).json({ error: 'Failed to create department' });
  }
};
