const mongoose = require('mongoose');

const advisorSchema = new mongoose.Schema({
  studentEmail: { type: String, required: true},
  advisorEmail: { type: String, required: true, default: '2022csb1062@iitrpr.ac.in'},  
});

module.exports = mongoose.model('Advisor', advisorSchema);
