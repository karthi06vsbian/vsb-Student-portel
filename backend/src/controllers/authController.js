const Teacher = require('../models/teacher.model');
const Student = require('../models/student.model').Student;
const { hashPassword, comparePassword } = require('../utils/hashPassword');
const { generateToken } = require('../utils/generateToken');

function sanitizeStudent(student) {
  if (!student) return null;
  const { password_hash, ...rest } = student;
  return rest;
}

function sanitizeTeacher(teacher) {
  if (!teacher) return null;
  const { password_hash, ...rest } = teacher;
  return rest;
}

exports.studentLogin = async (req, res) => {
  try {
    const { registerNo, dob, password } = req.body;

    if (!registerNo) {
      return res.status(400).json({ error: 'Register number is required' });
    }

    const student = await Student.findByRegisterNo(registerNo);
    if (!student) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (student.must_change_password) {
      if (!dob) {
        return res.status(400).json({ error: 'Date of birth is required for first login' });
      }
      const dobStr = new Date(student.dob).toISOString().slice(0, 10);
      if (dob !== dobStr) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      return res.json({
        mustChangePassword: true,
        studentId: student.id,
        registerNo: student.register_no,
        message: 'Please set a new password',
      });
    }

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const valid = await comparePassword(password, student.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken({ id: student.id, role: 'student', registerNo: student.register_no });

    res.json({
      token,
      user: sanitizeStudent(student),
      mustChangePassword: false,
    });
  } catch (err) {
    console.error('Student login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.studentSetPassword = async (req, res) => {
  try {
    const { registerNo, dob, newPassword } = req.body;

    if (!registerNo || !dob || !newPassword) {
      return res.status(400).json({ error: 'Register number, DOB, and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const student = await Student.findByRegisterNo(registerNo);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const dobStr = new Date(student.dob).toISOString().slice(0, 10);
    if (dob !== dobStr) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordHash = await hashPassword(newPassword);
    await Student.updatePassword(student.id, passwordHash);

    const updated = await Student.findById(student.id);
    const token = generateToken({ id: updated.id, role: 'student', registerNo: updated.register_no });

    res.json({
      token,
      user: sanitizeStudent(updated),
      message: 'Password set successfully',
    });
  } catch (err) {
    console.error('Student set password error:', err);
    res.status(500).json({ error: 'Failed to set password' });
  }
};

exports.teacherLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const teacher = await Teacher.findByUsername(username);
    if (!teacher) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await comparePassword(password, teacher.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (teacher.must_change_password) {
      return res.json({
        mustChangePassword: true,
        teacherId: teacher.id,
        username: teacher.username,
        message: 'Please set a new password',
      });
    }

    const token = generateToken({ id: teacher.id, role: 'teacher', username: teacher.username });

    res.json({
      token,
      user: sanitizeTeacher(teacher),
      mustChangePassword: false,
    });
  } catch (err) {
    console.error('Teacher login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.teacherSetPassword = async (req, res) => {
  try {
    const { username, currentPassword, newPassword } = req.body;

    if (!username || !currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Username, current password, and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const teacher = await Teacher.findByUsername(username);
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    const valid = await comparePassword(currentPassword, teacher.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid current password' });
    }

    const passwordHash = await hashPassword(newPassword);
    const updated = await Teacher.updatePassword(teacher.id, passwordHash);

    const token = generateToken({ id: updated.id, role: 'teacher', username: updated.username });

    res.json({
      token,
      user: updated,
      message: 'Password updated successfully',
    });
  } catch (err) {
    console.error('Teacher set password error:', err);
    res.status(500).json({ error: 'Failed to set password' });
  }
};
