const Enrollment = require('../models/enrollmentModel');
const Course = require('../models/courseModel');
const Advisor=require('../models/advisorModel');

// Request enrollment
const requestEnrollment = async (req, res) => {
  const { studentEmail, courseId } = req.body;
  const studentemail=studentEmail;

  try {
    // Validate input
    if (!studentEmail || !courseId) {
      return res.status(400).json({ error: 'Student email and course ID are required' });
    }

    // Fetch the course using the provided courseId (ObjectId)
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if the student is already enrolled in the course
    const existingEnrollment = await Enrollment.findOne({
      studentEmail,
      courseId,
    });

    if (existingEnrollment) {
      return res.status(400).json({ error: 'Student is already enrolled or has a pending request for this course' });
    }

    const facultyadvisor=await Advisor.findOne({ studentEmail: studentemail})



    // Create a new enrollment request
    const newEnrollment = new Enrollment({
      studentEmail,
      courseId: course._id, // Use the course's ObjectId
      instructorEmail: course.instructor, // Assuming `instructor` is an email in Course model
      advisorEmail: facultyadvisor.advisorEmail,
      courseName: course.courseId, // Assuming `courseId` in Course model is a string like "CS101"
      status: 'Instructor Approval Pending',
    });

    await newEnrollment.save();

    res.status(201).json({ message: 'Enrollment request sent successfully', enrollment: newEnrollment });
  } catch (error) {
    console.error('Error sending enrollment request:', error);
    res.status(500).json({ error: 'Error sending enrollment request' });
  }
};


// Approve enrollment by instructor
const approveByInstructor = async (req, res) => {
  const { enrollmentId } = req.body;
  try {
    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment || enrollment.status !== 'Instructor Approval Pending') {
      return res.status(400).json({ message: 'Invalid enrollment or already processed' });
    }
    enrollment.status = 'Faculty Advisor Approval Pending';
    await enrollment.save();
    res.status(200).json({ message: 'Enrollment approved by instructor', enrollment });
  } catch (error) {
    res.status(500).json({ message: 'Error approving enrollment', error });
  }
};

//Approve enrollment by advisor
const approveByAdvisor = async (req, res) => {
  const { enrollmentId } = req.body;
  try {
    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment || enrollment.status !== 'Faculty Advisor Approval Pending') {
      return res.status(400).json({ message: 'Invalid enrollment or not instructor-approved' });
    }
    enrollment.status = 'Enrolled';
    await enrollment.save();
    res.status(200).json({ message: 'Enrollment approved by advisor', enrollment });
  } catch (error) {
    res.status(500).json({ message: 'Error approving enrollment', error });
  }
};

//Dropped by student
const dropBystudent = async(req, res) => {
  const {enrollmentId} = req.body;
  try{
    const enrollment = await Enrollment.findById(enrollmentId);
    //console.log(enrollment.status);
    if(!enrollment || enrollment.status === 'Instructor Rejected' || enrollment.status === 'Faculty Advisor Rejected'){
      return res.status(400).json({ message: 'Invalid drop You were already rejected (like Sagar)' });
    }
    enrollment.status = 'Dropped by student';
    await enrollment.save();
    res.status(200).json({message : 'Course dropped successfully'});
  } catch (error){
    //console.log(enrollmentId);
    res.status(500).json({message : 'Error dropping the course'});
  }
};


// Fetch enrolled courses for a student
const getEnrolledCourses = async (req, res) => {
  const { studentEmail } = req.query;
  try {
    const enrollments = await Enrollment.find({ studentEmail });
    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching enrolled courses', error });
  }
};

// Fetch available courses for a student
const getAvailableCourses = async (req, res) => {
  console.log('hello')
  const { studentEmail } = req.query;

  try {
    // Fetch all enrollments for the student
    const enrollments = await Enrollment.find({ studentEmail });

    // Get the courseIds that the student is already enrolled in
    const enrolledCourseIds = enrollments.map((enrollment) => enrollment.courseId);

    // If the student is not enrolled in any courses, return all courses with courseName
    let availableCourses = [];
    if (enrolledCourseIds.length === 0) {
      availableCourses = await Course.find();
    } else {
      // Find all courses that the student is not enrolled in
      availableCourses = await Course.find({
        _id: { $nin: enrolledCourseIds },
      });
    }

    // For each available course, fetch and append the courseName
    const availableCoursesWithNames = await Promise.all(
      availableCourses.map(async (Course) => {
        // Append the courseName from the Course model
        const courseData = {
          ...course.toObject(), // Spread the course data
          coursename: Course.courseName, // Add courseName field
        };
        return courseData;
      })
    );

    // Send the available courses with course names in the response
    res.status(200).json(availableCoursesWithNames);
  } catch (error) {
    console.error('Error fetching available courses:', error);
    res.status(500).json({ message: 'Error fetching available courses', error });
  }
};


module.exports = { 
  requestEnrollment, 
  approveByInstructor, 
  approveByAdvisor, 
  getEnrolledCourses, 
  getAvailableCourses,
  dropBystudent 
};
