const { verifyToken } = require('../utils/jwt');

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);
  try {
    const decoded = verifyToken(authHeader.split(' ')[1]);
    req.user = decoded;
    next();
  } catch {
    res.sendStatus(403);
  }
};

module.exports = { authenticateJWT };