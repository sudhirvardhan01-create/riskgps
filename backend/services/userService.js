// backend/services/userService.js
const db = require('../models');
const CustomError = require('../utils/CustomError');
const Messages = require('../constants/messages');
const HttpStatus = require('./constants/httpStatusCodes');

exports.getAllUsers = async () => {
    const user = await db.User.findAll();
    if (!user) {
        throw new CustomError(MESSAGES.USER.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return user;
};

exports.createUser = async (name) => {
  if (!name) throw new Error('Name is required');
  return await db.User.create({ name });
};
