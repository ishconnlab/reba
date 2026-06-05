const User = require('../models/User');

const createUser = async (req, res, next) => {
  try {
    const { userName, password, role } = req.body;

    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const user = await User.create({ userName, password, role });
    res.status(201).json({
      _id: user._id,
      userName: user.userName,
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const { search } = req.query;
    let filter = {};
    if (search) {
      filter.userName = { $regex: search, $options: 'i' };
    }
    const users = await User.find(filter).select('-password');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { userName, password, role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (userName) user.userName = userName;
    if (role) user.role = role;
    if (password) user.password = password;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      userName: updatedUser.userName,
      role: updatedUser.role,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createUser, getUsers, getUser, updateUser, deleteUser };
