const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Student = require('../models/Student');

const JWT_SECRET = process.env.JWT_SECRET || 'unispace_super_secret_key';

// POST /api/student-auth/register
router.post('/register', async (req, res) => {
  try {
    const { studentId, password } = req.body;
    let student = await Student.findOne({ studentId });
    if (student) return res.status(400).json({ message: 'Student ID already exists' });

    student = new Student({ studentId, password });
    await student.save();
    res.status(201).json({ message: 'Student registered successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during student registration' });
  }
});

// POST /api/student-auth/login
router.post('/login', async (req, res) => {
  try {
    const { studentId, password } = req.body;
    const student = await Student.findOne({ studentId });
    if (!student) return res.status(400).json({ message: 'Invalid Student ID or password' });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid Student ID or password' });

    // Generate secure token valid for 24 hours
    const token = jwt.sign({ id: student._id, studentId: student.studentId, role: 'student' }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, studentId: student.studentId });
  } catch (error) {
    res.status(500).json({ message: 'Server error during student login' });
  }
});

module.exports = router;