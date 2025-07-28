const jwt = require('jsonwebtoken');
const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || 'accesssecret';
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refreshsecret';

// Access token: short expiry (e.g., 15 min)
const generateToken = (payload) =>
  jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });

// Refresh token: longer expiry (e.g., 7 days)
const generateRefreshToken = (payload) =>
  jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });

const verifyToken = (token) => jwt.verify(token, ACCESS_SECRET);
const verifyRefreshToken = (token) => jwt.verify(token, REFRESH_SECRET);

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
};
