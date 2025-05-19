const mongoose = require('mongoose');
const dotenv = require('dotenv');
const seedMessData = require('../utils/messSeeder')

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/stayswap';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI); 
    console.log('Connected to MongoDB');
    await seedMessData();
    console.log('Seeding process completed');
   
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
