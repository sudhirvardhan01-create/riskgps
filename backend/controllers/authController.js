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
    const { user, token } = await authService.login(req.body);
    res.json({ message: 'Logged in', user: { id: user.id, username: user.username, role: user.Role.name }, token });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

module.exports = { register, login };