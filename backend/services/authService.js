const bcrypt = require('bcryptjs');
const { User, Role, RefreshToken } = require('../models');
const { generateToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');

const register = async ({ username, email, password, roleName }) => {
  const hashed = await bcrypt.hash(password, 10);
  const role = await Role.findOne({ where: { name: roleName } });
  if (!role) throw new Error('Invalid role');
  return await User.create({ name: username, email, password: hashed, roleId: role.id });
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ where: { email }, include: Role });
  if (!user) throw new Error('Invalid credentials');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Invalid credentials');

  const accessToken = generateToken({ id: user.id, username: user.username, role: user.Role.name });
  const refreshToken = generateRefreshToken({ id: user.id });

  await RefreshToken.create({ token: refreshToken, userId: user.id });

  return { user, accessToken, refreshToken };
};

const refresh = async (token) => {
  const storedToken = await RefreshToken.findOne({ where: { token } });
  if (!storedToken) throw new Error('Invalid or revoked refresh token');

  try {
    const decoded = verifyRefreshToken(token);
    const user = await User.findByPk(decoded.id, { include: Role });
    if (!user) throw new Error('User not found');

    return generateToken({ id: user.id, username: user.username, role: user.Role.name });
  } catch {
    throw new Error('Invalid refresh token');
  }
};

const logout = async (token) => {
  await RefreshToken.destroy({ where: { token } });
};

module.exports = { register, login, refresh, logout };
