const bcrypt = require("bcryptjs");
const { User, Role, RefreshToken } = require("../models");
const {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt");
const CustomError = require("../utils/CustomError");
const HttpStatus = require("../constants/httpStatusCodes");
const MESSAGES = require("../constants/messages");

class AuthService {
  /**
   * Register a new user
   */
  static async register(payload) {
    const {
      name,
      email,
      password,
      phone,
      organisation,
      message,
      communicationPreference,
      roleName,
    } = payload;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Find role
    const role = await Role.findOne({ where: { name: roleName } });
    if (!role) {
      throw new CustomError(MESSAGES.AUTH.INVALID_ROLE, HttpStatus.BAD_REQUEST);
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      organisation,
      message,
      communicationPreference,
      roleId: role.roleId,
    });

    return user;
  }

  /**
   * Login user
   */
  static async login({ email, password }) {
    const user = await User.findOne({
      where: { email },
      include: [{ model: Role, as: "role", where: { isDeleted: false }, required: false }],
    });

    if (!user) {
      throw new CustomError(MESSAGES.AUTH.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new CustomError(MESSAGES.AUTH.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
    }

    const accessToken = generateToken({
      id: user.userId,
      username: user.name,
      role: user.role?.name,
    });

    const refreshToken = generateRefreshToken({ id: user.userId });

    await RefreshToken.create({ token: refreshToken, userId: user.userId });

    return { user, accessToken, refreshToken };
  }

  /**
   * Refresh access token
   */
  static async refresh(refreshToken) {
    const storedToken = await RefreshToken.findOne({ where: { token: refreshToken } });
    if (!storedToken) {
      throw new CustomError(MESSAGES.AUTH.INVALID_REFRESH_TOKEN, HttpStatus.UNAUTHORIZED);
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findByPk(decoded.id, { include: [{ model: Role, as: "role" }] });

    if (!user) {
      throw new CustomError(MESSAGES.USER.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const accessToken = generateToken({
      id: user.userId,
      username: user.name,
      role: user.role?.name,
    });

    return { accessToken, msg: MESSAGES.AUTH.REFRESH_SUCCESS };
  }

  /**
   * Logout user (invalidate refresh token)
   */
  static async logout(refreshToken) {
    await RefreshToken.destroy({ where: { token: refreshToken } });
    return { msg: MESSAGES.AUTH.LOGOUT_SUCCESS };
  }
}

module.exports = AuthService;
