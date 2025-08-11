const { verifyToken } = require('../utils/jwt');
const HttpStatus = require('../constants/httpStatusCodes');

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
    if (!authHeader) return res.sendStatus(HttpStatus.UNAUTHORIZED);
  try {
    const decoded = verifyToken(authHeader.split(' ')[1]);
    req.user = decoded;
    next();
  } catch {
      res.sendStatus(HttpStatus.FORBIDDEN);
  }
};

module.exports = { authenticateJWT };