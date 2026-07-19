const express = require('express');
const sectionController = require('../controllers/sectionController');
const authTeacher = require('../middleware/authTeacher');

const router = express.Router();

router.get('/', authTeacher, sectionController.getByBatch);
router.post('/', authTeacher, sectionController.create);

module.exports = router;
