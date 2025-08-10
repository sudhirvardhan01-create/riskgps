const customError = require('../utils/CustomError');
const messages = require('../constants/messages');
const HttpStatus = require('./constants/httpStatusCodes');

module.exports = (err, req, res, next) => {
    const statusCode = err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    const message = err.message || messages.GENERAL.SERVER_ERROR;

    res.status(statusCode).json({
        success: false,
        error: {
            message,
            details: err.details || null,
        },
    });
};