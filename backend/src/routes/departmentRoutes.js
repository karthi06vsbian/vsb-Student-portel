const express = require('express');
const departmentController = require('../controllers/departmentController');
const authTeacher = require('../middleware/authTeacher');

const router = express.Router();

router.get('/', authTeacher, departmentController.getAll);
router.post('/', authTeacher, departmentController.create);

module.exports = router;
