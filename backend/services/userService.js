// backend/services/userService.js
const db = require('../models');
const CustomError = require('../utils/CustomError');
const Messages = require('../constants/messages');

//exports.getAllUsers = async () => {
//  return await db.User.findAll();
//};

exports.getAllUsers = async () => {
    const user = await db.User.findAll();
    if (!user) {
        throw new CustomError(MESSAGES.USER.NOT_FOUND, 404);
    }
    return user;
};

exports.createUser = async (name) => {
  if (!name) throw new Error('Name is required');
  return await db.User.create({ name });
};
