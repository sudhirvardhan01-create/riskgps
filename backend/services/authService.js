const bcrypt = require('bcryptjs');
const { User, Role, RefreshToken } = require('../models');
const {
    generateToken,
    generateRefreshToken,
    verifyRefreshToken
} = require('../utils/jwt');

const CustomError = require('../utils/CustomError');
const HttpStatus = require('../constants/httpStatusCodes');
const MESSAGES = require('../constants/messages');

const register = async ({
    name,
    email,
    password,
    phone,
    organisation,
    message,
    communicationPreference,
    roleName
}) => {
    console.log('Registering user with email:', email);

    const hashed = await bcrypt.hash(password, 10);
    const role = await Role.findOne({ where: { name: roleName } });

    if (!role) {
        console.log('Invalid role:', roleName);
        throw new CustomError(MESSAGES.AUTH.INVALID_ROLE, HttpStatus.BAD_REQUEST);
    }

    const user = await User.create({
        name,
        email,
        password: hashed,
        phone,
        organisation,
        message,
        communicationPreference,
        roleId: role.id
    });

    console.log('User registered successfully with ID:', user.id);
    return {
        data: user,
        message: MESSAGES.USER.CREATED
    };
};

const login = async ({ email, password }) => {
    console.log('Attempting login for:', email);

    const user = await User.findOne({ where: { email }, include: Role });
    if (!user) {
        console.log('Login failed: user not found');
        throw new CustomError(MESSAGES.AUTH.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        console.log('Login failed: password mismatch');
        throw new CustomError(MESSAGES.AUTH.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
    }

    const accessToken = generateToken({
        id: user.id,
        username: user.username,
        role: user.Role.name
    });

    const refreshToken = generateRefreshToken({ id: user.id });

    await RefreshToken.create({ token: refreshToken, userId: user.id });

    console.log('Login successful for user ID:', user.id);
    return {
        user,
        accessToken,
        refreshToken,
        message: MESSAGES.AUTH.LOGIN_SUCCESS
    };
};

const refresh = async (token) => {
    console.log('Refreshing token');

    const storedToken = await RefreshToken.findOne({ where: { token } });
    if (!storedToken) {
        console.log('Refresh token not found in DB');
        throw new CustomError(MESSAGES.AUTH.INVALID_REFRESH_TOKEN, HttpStatus.UNAUTHORIZED);
    }

    try {
        const decoded = verifyRefreshToken(token);
        const user = await User.findByPk(decoded.id, { include: Role });

        if (!user) {
            console.log('User not found for refresh token');
            throw new CustomError(MESSAGES.USER.NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        const accessToken = generateToken({
            id: user.id,
            username: user.username,
            role: user.Role.name
        });

        console.log('Access token refreshed successfully');
        return {
            accessToken,
            message: MESSAGES.AUTH.REFRESH_SUCCESS
        };
    } catch (err) {
        console.log('Failed to verify refresh token');
        throw new CustomError(MESSAGES.AUTH.INVALID_REFRESH_TOKEN, HttpStatus.UNAUTHORIZED);
    }
};

const logout = async (token) => {
    console.log('Logging out with token:', token);
    await RefreshToken.destroy({ where: { token } });
    console.log('Refresh token invalidated');
    return {
        message: MESSAGES.AUTH.LOGOUT_SUCCESS
    };
};

module.exports = {
    register,
    login,
    refresh,
    logout
};
