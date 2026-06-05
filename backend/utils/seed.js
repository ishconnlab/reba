const User = require('../models/User');

const seedAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ userName: 'admin' });
    if (!existingAdmin) {
      await User.create({
        userName: 'admin',
        password: 'admin123',
        role: 'admin',
      });
      console.log('Default admin user created: admin / admin123');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Failed to seed admin user:', error.message);
  }
};

module.exports = seedAdmin;
