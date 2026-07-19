const Section = require('../models/section.model');

exports.getByBatch = async (req, res) => {
  try {
    const { batchId } = req.query;
    if (!batchId) {
      return res.status(400).json({ error: 'batchId is required' });
    }
    const sections = await Section.findByBatch(batchId);
    res.json(sections);
  } catch (err) {
    console.error('Get sections error:', err);
    res.status(500).json({ error: 'Failed to fetch sections' });
  }
};

exports.create = async (req, res) => {
  try {
    const { batch_id, name } = req.body;
    if (!batch_id || !name) {
      return res.status(400).json({ error: 'batch_id and name are required' });
    }
    const section = await Section.create({ batch_id, name });
    res.status(201).json(section);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Section already exists for this batch' });
    }
    console.error('Create section error:', err);
    res.status(500).json({ error: 'Failed to create section' });
  }
};
