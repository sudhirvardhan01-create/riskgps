const authService = require('../services/authService');
const catchAsync = require('../utils/catchAsync');
const messages = require('../constants/messages');
const HttpStatus = require('./constants/httpStatusCodes');

const register = catchAsync(async (req, res) => {
    const user = await authService.register(req.body);
    res.status(HttpStatus.OK).json({ message: messages.USER.CREATED, user: { id: user.id, username: user.username, email: user.email } });
});


const login = async (req, res) => {
    try {
        const { user, accessToken, refreshToken } = await authService.login(req.body);
        res.json({ message: 'Logged in', user: { id: user.id, username: user.username, role: user.Role.name }, access_token: accessToken, refresh_token: refreshToken });
    } catch (err) {
        res.status(HttpStatus.UNAUTHORIZED).json({ error: err.message });
    }
};

const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Refresh token missing' });
        }
        const newAccessToken = await authService.refresh(refreshToken);
        res.json({ accessToken: newAccessToken });
    } catch (err) {
        res.status(HttpStatus.UNAUTHORIZED).json({ error: err.message });
    }
};

const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Refresh token missing' });
        await authService.logout(refreshToken);
        res.json({ message: 'Logged out successfully' });
    } catch (err) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};

module.exports = { register, login, refresh, logout };