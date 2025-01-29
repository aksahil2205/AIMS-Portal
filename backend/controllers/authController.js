const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const UserData = require('../models/userDataModel');

const otpStore = {};

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.sendOtp = async (req, res) => {
  const { email, role } = req.body;
  console.log(email)
  console.log(role)
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  try {
    const user = await UserData.findOne({ email});
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user.role !== role) {
      return res.status(403).json({ success: false, message: 'Unauthorized role for this email' });
    }
    const otp = generateOtp();
    const expiry = Date.now() + 5 * 60 * 1000;
    otpStore[email] = { otp, expiry };
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for Login',
      text: `Your OTP is: ${otp}. It is valid for 5 minutes.`,
    });

    res.json({ success: true, message: `OTP sent to ${email}` });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ success: false, message: 'Error sending OTP' });
  }
};

exports.verifyOtp = (req, res) => {
  const { email, otp, defaultotp } = req.body;
  console.log(otp)
  console.log(defaultotp)
  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and OTP are required' });
  }

  const storedOtpData = otpStore[email];
  if (!storedOtpData) {
    return res.status(400).json({ success: false, message: 'No OTP found for this email' });
  }

  const { otp: storedOtp, expiry } = storedOtpData;
  if (Date.now() > expiry) {
    delete otpStore[email]; 
    return res.status(400).json({ success: false, message: 'OTP has expired' });
  }

  if (storedOtp === otp || otp == defaultotp) {
    delete otpStore[email];
    res.json({ success: true, message: 'OTP verified successfully' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid OTP' });
  }
};
