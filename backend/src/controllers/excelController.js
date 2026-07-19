const XLSX = require('xlsx');
const { Student, ALL_STUDENT_FIELDS } = require('../models/student.model');
const { hashPassword } = require('../utils/hashPassword');
const { parseExcelRows, buildExportRows } = require('../utils/excelParser');

exports.upload = async (req, res) => {
  try {
    const { sectionId } = req.query;
    if (!sectionId) {
      return res.status(400).json({ error: 'sectionId is required' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Excel file is required' });
    }

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

    const results = { added: 0, skipped: 0, errors: [] };

    for (const row of rows) {
      const parsed = parseExcelRows(row);

      if (!parsed.register_no || !parsed.password) {
        results.skipped++;
        results.errors.push(`Skipped row: missing RegisterNo or Password`);
        continue;
      }

      try {
        const existing = await Student.findByRegisterNo(parsed.register_no);
        if (existing) {
          results.skipped++;
          results.errors.push(`Skipped ${parsed.register_no}: duplicate register number`);
          continue;
        }

        const passwordHash = await hashPassword(String(parsed.password));
        const { password, dob, ...rest } = parsed;

        await Student.create({
          section_id: parseInt(sectionId, 10),
          register_no: String(parsed.register_no),
          dob: dob || '2000-01-01',
          password_hash: passwordHash,
          must_change_password: true,
          ...rest,
        });

        results.added++;
      } catch (err) {
        results.skipped++;
        results.errors.push(`Skipped ${parsed.register_no}: ${err.message}`);
      }
    }

    res.json({
      message: `Import complete: ${results.added} added, ${results.skipped} skipped`,
      ...results,
    });
  } catch (err) {
    console.error('Excel upload error:', err);
    res.status(500).json({ error: 'Failed to process Excel file' });
  }
};

exports.download = async (req, res) => {
  try {
    const { sectionId } = req.query;
    if (!sectionId) {
      return res.status(400).json({ error: 'sectionId is required' });
    }

    const students = await Student.findBySection(sectionId);
    const exportData = buildExportRows(students);

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', `attachment; filename=section_${sectionId}_students.xlsx`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (err) {
    console.error('Excel download error:', err);
    res.status(500).json({ error: 'Failed to export Excel file' });
  }
};
