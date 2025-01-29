const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  studentEmail: { type: String, required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  instructorEmail: { type: String, required: true },
  advisorEmail: { type: String, required: true, default: '2022csb1062@iitrpr.ac.in'},
  courseName : {type : String , required : true},
  status: {
    type: String,
    enum: ['Instructor Approval Pending', 'Faculty Advisor Approval Pending', 'Instructor Rejected', 'Faculty Advisor Rejected','Enrolled',  'Dropped by student'],
    default: 'Instructor Pending',
  },
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);
