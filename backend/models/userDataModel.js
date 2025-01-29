const mongoose = require('mongoose');

// Define the User schema
const userDataSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['student', 'instructor', 'faculty advisor', 'admin'],
  },
  name: {
    type: String,
    required: true,
  },
});

// Create and export the User model
const UserData = mongoose.model('UserData', userDataSchema);

module.exports = UserData;
