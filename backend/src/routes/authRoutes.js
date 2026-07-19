const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/student/login', authController.studentLogin);
router.post('/student/set-password', authController.studentSetPassword);
router.post('/teacher/login', authController.teacherLogin);
router.post('/teacher/set-password', authController.teacherSetPassword);

module.exports = router;
