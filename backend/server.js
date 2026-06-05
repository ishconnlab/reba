const app = require('./app');
const connectDB = require('./config/db');
const seedAdmin = require('./utils/seed');

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  await seedAdmin();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
