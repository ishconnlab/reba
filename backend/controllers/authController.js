const User = require('../models/User');

const login = async (req, res, next) => {
  try {
    const { userName, password } = req.body;

    const user = await User.findOne({ userName }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    req.session.userId = user._id;
    req.session.role = user.role;
    req.session.userName = user.userName;

    res.json({
      _id: user._id,
      userName: user.userName,
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
};

const logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      _id: user._id,
      userName: user.userName,
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { login, logout, getMe };
