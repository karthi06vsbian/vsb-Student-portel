const { verifyToken } = require('../utils/generateToken');

function authTeacher(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = verifyToken(header.slice(7));
    if (decoded.role !== 'teacher') {
      return res.status(403).json({ error: 'Teacher access only' });
    }
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = authTeacher;
