const express = require('express');
const batchController = require('../controllers/batchController');
const authTeacher = require('../middleware/authTeacher');

const router = express.Router();

router.get('/', authTeacher, batchController.getByDepartment);
router.post('/', authTeacher, batchController.create);

module.exports = router;
