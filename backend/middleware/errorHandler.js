const customError = require('../utils/CustomError');
const messages = require('../constants/messages');

module.exports = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || messages.GENERAL.SERVER_ERROR;

    res.status(statusCode).json({
        success: false,
        error: {
            message,
            details: err.details || null,
        },
    });
};