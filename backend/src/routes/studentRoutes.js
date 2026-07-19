const express = require('express');
const studentController = require('../controllers/studentController');
const authTeacher = require('../middleware/authTeacher');
const authStudent = require('../middleware/authStudent');

const router = express.Router();

router.get('/me', authStudent, studentController.getMe);
router.put('/me', authStudent, studentController.updateMe);

router.get('/', authTeacher, studentController.getBySection);
router.post('/', authTeacher, studentController.create);
router.get('/:id', authTeacher, studentController.getById);
router.put('/:id', authTeacher, studentController.update);
router.delete('/:id', authTeacher, studentController.remove);

module.exports = router;
