const { STATUS_SUPPORTED_VALUES } = require("../../../constants/library");
const CustomError = require("../../../utils/CustomError");
const Messages = require("../../../constants/messages");
const HttpStatus = require("../../../constants/httpStatusCodes");

const validateProcessData = (data) => {
    const { process_name, status } = data;

    if (!process_name) {
        throw new CustomError(Messages.PROCESS.PROCESS_NAME_REQUIRED, HttpStatus.BAD_REQUEST);
    }

    if (status && !STATUS_SUPPORTED_VALUES.includes(status)) {
        throw new CustomError(Messages.PROCESS.INVALID_VALUE, HttpStatus.BAD_REQUEST);
    }
};

module.exports = {
    validateProcessData,
};
