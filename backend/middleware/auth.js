const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'unispace_super_secret_key';

module.exports = function (req, res, next) {
  // Grab token from header
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.adminId = decoded.id;
    next(); // Access granted, proceed to the route
  } catch (err) {
    res.status(401).json({ message: 'Token is invalid or expired' });
  }
};