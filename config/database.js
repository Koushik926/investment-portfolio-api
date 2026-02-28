const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGODB_URI ||
      process.env.MONGO_URI ||
      'mongodb://localhost:27017/investment-portfolio';

    await mongoose.connect(mongoURI);
    
    console.log('MongoDB connection established successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('MongoDB disconnection error:', error.message);
    process.exit(1);
  }
};

module.exports = {
  connectDB,
  disconnectDB,
};
