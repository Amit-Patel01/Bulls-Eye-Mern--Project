const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bullsmearn';
    
    await mongoose.connect(mongoURI);

    console.log('✅ MongoDB Connected Successfully');
    return mongoose.connection;
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    
    // Provide helpful error messages
    if (err.message.includes('ECONNREFUSED')) {
      console.error('💡 Tip: Make sure MongoDB is running on localhost:27017');
      console.error('   Or update MONGODB_URI in .env');
    }
    if (err.message.includes('authentication failed')) {
      console.error('💡 Tip: Check your MongoDB username and password');
    }
    
    process.exit(1);
  }
};

module.exports = connectDB;
