const authService = require('../services/authService');

const register = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    res.json({ message: 'User registered', user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { user, accessToken, refreshToken } = await authService.login(req.body);
    res.json({ message: 'Logged in', user: { id: user.id, username: user.username, role: user.Role.name }, access_token: accessToken, refresh_token: refreshToken });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token missing' });
    }
    const newAccessToken = await authService.refresh(refreshToken);
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: 'Refresh token missing' });
    await authService.logout(refreshToken);
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login, refresh, logout };