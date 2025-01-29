const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: String, required: true },
  otpExpiresAt: { type: Date, required: true },
});

module.exports = mongoose.model('User', userSchema);
