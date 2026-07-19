const { Student } = require('../models/student.model');
const { hashPassword } = require('../utils/hashPassword');

function sanitizeStudent(student) {
  if (!student) return null;
  const { password_hash, ...rest } = student;
  return rest;
}

exports.getBySection = async (req, res) => {
  try {
    const { sectionId } = req.query;
    if (!sectionId) {
      return res.status(400).json({ error: 'sectionId is required' });
    }
    const students = await Student.findBySection(sectionId);
    res.json(students.map(sanitizeStudent));
  } catch (err) {
    console.error('Get students error:', err);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};

exports.getById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(sanitizeStudent(student));
  } catch (err) {
    console.error('Get student error:', err);
    res.status(500).json({ error: 'Failed to fetch student' });
  }
};

exports.create = async (req, res) => {
  try {
    const { section_id, register_no, dob, password, ...rest } = req.body;

    if (!section_id || !register_no || !dob || !password) {
      return res.status(400).json({ error: 'section_id, register_no, dob, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const passwordHash = await hashPassword(password);

    const student = await Student.create({
      section_id,
      register_no,
      dob,
      password_hash: passwordHash,
      must_change_password: false,
      ...rest,
    });

    res.status(201).json(sanitizeStudent(student));
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Register number already exists' });
    }
    console.error('Create student error:', err);
    res.status(500).json({ error: 'Failed to create student' });
  }
};

exports.update = async (req, res) => {
  try {
    const existing = await Student.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const { password, ...studentData } = req.body;
    let student = await Student.update(req.params.id, studentData);

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }
      const passwordHash = await hashPassword(password);
      student = await Student.updatePassword(req.params.id, passwordHash);
    }

    res.json(sanitizeStudent(student));
  } catch (err) {
    console.error('Update student error:', err);
    res.status(500).json({ error: 'Failed to update student' });
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Student.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error('Delete student error:', err);
    res.status(500).json({ error: 'Failed to delete student' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(sanitizeStudent(student));
  } catch (err) {
    console.error('Get me error:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const student = await Student.update(req.user.id, {
      ...req.body,
      profile_completed: true,
    }, { fillableOnly: true });

    res.json(sanitizeStudent(student));
  } catch (err) {
    console.error('Update me error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};
