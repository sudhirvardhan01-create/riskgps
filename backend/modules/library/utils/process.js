const { STATUS_SUPPORTED_VALUES } = require("../../../constants/library");


const validateProcessData = (data) => {
    const { process_name, status } = data;

    if (!process_name) {
      throw new Error("process_name is required.");
    }

    if (status && !STATUS_SUPPORTED_VALUES .includes(status)) {
      throw new Error("Invalid Value for Status");
    }
}

module.exports = {
  validateProcessData
}