// backend/services/userService.js
const db = require('../models');

exports.getAllUsers = async () => {
  return await db.User.findAll();
};

exports.createUser = async (name) => {
  if (!name) throw new Error('Name is required');
  return await db.User.create({ name });
};
