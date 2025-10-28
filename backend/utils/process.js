const HttpStatus = require("../constants/httpStatusCodes");
const { GENERAL } = require("../constants/library");
const Messages = require("../constants/messages");
const CustomError = require("./CustomError");


const validateProcessData = (data) => {
    const { processName, status } = data;

    if (!processName) {
        throw new CustomError(Messages.PROCESS.PROCESS_NAME_REQUIRED, HttpStatus.BAD_REQUEST);
    }

    if (status && !GENERAL.STATUS_SUPPORTED_VALUES.includes(status)) {
        throw new CustomError(Messages.PROCESS.INVALID_VALUE, HttpStatus.BAD_REQUEST);
    }
};

module.exports = {
    validateProcessData,
};
