const bcrypt = require('bcryptjs');
const { User, Role } = require('../models');
const { generateToken } = require('../utils/jwt');

const register = async ({ name, email, password, phone, organisation, message, communicationPreference, roleName }) => {
  const hashed = await bcrypt.hash(password, 10);
  const role = await Role.findOne({ where: { name: roleName } });
  if (!role) throw new Error('Invalid role');
  const user = await User.create({ name, email, password: hashed, phone, organisation, message, communicationPreference, roleId: role.id });
  return user;
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ where: { email }, include: Role });
  if (!user) throw new Error('Invalid credentials');
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Invalid credentials');
  const token = generateToken({ id: user.id, username: user.username, role: user.Role.name });
  return { user, token };
};

module.exports = { register, login };