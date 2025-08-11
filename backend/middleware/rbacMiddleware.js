const HttpStatus = require('./constants/httpStatusCodes');

const rbac = (roles = []) => (req, res, next) => {
    if (!roles.includes(req.user.role)) return res.status(HttpStatus.FORBIDDEN).json({ message: 'Forbidden' });
  next();
};

module.exports = rbac;