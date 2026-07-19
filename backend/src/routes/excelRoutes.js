const express = require('express');
const excelController = require('../controllers/excelController');
const authTeacher = require('../middleware/authTeacher');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/upload', authTeacher, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, excelController.upload);
router.get('/download', authTeacher, excelController.download);

module.exports = router;
