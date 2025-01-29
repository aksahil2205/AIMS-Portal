require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const Course = require('./models/courseModel'); // Ensure correct path
const Enrollments = require('./models/enrollmentModel'); // Ensure correct path
const userRoutes = require('./routes/userRoutes');
const advisorRoutes = require('./routes/advisorRoutes');
const UserData = require('./models/userDataModel');
//const Advisor = require('./models/advisorModel');

const app = express();
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Debugging Middleware
/*app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
});*/

const createDefaultUsers = async () => {
  try {
    const existingAdvisor = await UserData.findOne({ email: 'defaultadvisor@iitrpr.ac.in' });
    const existingAdmin = await UserData.findOne({email: 'defaultadmin@iitrpr.ac.in'});
    if (!existingAdvisor) {
      console.log('Creating default advisor...');
      // Create the default advisor user
      const defaultAdvisor = new UserData({
        email: 'defaultadvisor@iitrpr.ac.in',
        role: 'faculty advisor',
        name: 'Default Advisor',
      });
      await defaultAdvisor.save();
      console.log('Default advisor created successfully!');
    } else {
      console.log('Default advisor already exists.');
    }

    if (!existingAdmin) {
      console.log('Creating default admin...');
      // Create the default advisor user
      const defaultAdmin = new UserData({
        email: 'defaultadmin@iitrpr.ac.in',
        role: 'admin',  
        name: 'Default Admin',
      });
      await defaultAdmin.save();
      console.log('Default admin created successfully!');
    } else {
      console.log('Default admin already exists.');
    }
  } catch (error) {
    console.error('Error creating default advisor or admin:', error);
  }
};

// Run the createDefaultAdvisor function when the server starts
createDefaultUsers();

// Routes
app.use('/api', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/admin/users', userRoutes);
app.use('/admin/users/fetch', userRoutes);
app.use('/admin/advisors', advisorRoutes);

// Get Enrolled Courses
app.get('/api/enrollments/instructor/:email', async (req, res) => {
  const { email } = req.params;

  try {
    console.log('Fetching enrollments for instructor:', email);
    
    //console.log(Enrollments);
    const allEnrollments  = await Enrollments.find();
    //console.log(allEnrollments);
    //console.log(allEnrollments.length);
    const enrollmentRequests = await Enrollments.find({
      instructorEmail: email,
      status: { $in: ['Instructor Approval Pending'] }, 
    });

    
    
    if (!enrollmentRequests.length) {
      console.log('No enrollment requests found for advisor:', email);
    } else {
      console.log('Enrollment Requests:', enrollmentRequests);
    }


    const enrollmentsWithnames = await Promise.all(
      enrollmentRequests.map(async (enrollment) => {
        const course = await Course.findOne({ courseId: enrollment.courseName });
        const stud = await UserData.findOne({email : enrollment.studentEmail}); 
        // console.log(enrollment.courseName);
        //console.log(stud.data); 
        return {
          ...enrollment.toObject(),
          cname: course.courseName, // Add cname field with courseName
          whoami: stud.name
        };
      })
    );


    res.status(200).json(enrollmentsWithnames);
  } catch (error) {
    console.error('Error fetching enrollment requests for advisor:', error);
    res.status(500).json({ error: 'Error fetching enrollment requests' });
  }
});

app.get('/api/enrollments/advisor/:email', async (req, res) => {
  const { email } = req.params;

  try {
    console.log('Fetching enrollments for advisor:', email);
    
    //console.log(Enrollments);
    //const allEnrollments  = await Enrollments.find();
    //console.log(allEnrollments);
    //console.log(allEnrollments.length);
    const enrollmentRequests = await Enrollments.find({
      advisorEmail: email,
      status: { $in: ['Advisor Approval Pending'] }, 
    });
    
    const enrollmentsWithnames = await Promise.all(
      enrollmentRequests.map(async (enrollment) => {
        const course = await Course.findOne({ courseId: enrollment.courseName });
        const stud = await UserData.findOne({email : enrollment.studentEmail}); 
        // console.log(enrollment.courseName);
        //console.log(stud.data); 
        return {
          ...enrollment.toObject(),
          cname: course.courseName, // Add cname field with courseName
          whoami: stud.name
        };
      })
    );
    
    if (!enrollmentRequests.length) {
      console.log('No enrollment requests found for instructor:', email);
    } else {
      console.log('Enrollment Requests:', enrollmentRequests);
    }
    res.status(200).json(enrollmentsWithnames);
  } catch (error) {
    console.error('Error fetching enrollment requests for instructor:', error);
    res.status(500).json({ error: 'Error fetching enrollment requests' });
  }
});




// Get Available Courses
app.get('/api/available-courses', async (req, res) => {
  const { studentEmail } = req.query; // Extract the query parameter
  try {
    if (!studentEmail) {
      return res.status(400).json({ error: 'Student email is required' });
    }

    // Fetch the enrolled courses for the student
    const enrolledCourses = await Enrollments.find({ studentEmail });
    const enrolledCourseIds = enrolledCourses.map((enrollment) => enrollment.courseId);

    // Query for available courses excluding the ones the student is already enrolled in
    const availableCourses = await Course.find({ _id: { $nin: enrolledCourseIds } })
      .select('courseId courseName instructor'); // Select necessary fields

    // Populate courseName from the Course schema
    const availableCoursesWithNames = await Promise.all(
      availableCourses.map(async (course) => {
        const ins = await UserData.findOne({email: course.instructor});
        const courseData = {
          ...course.toObject(),
          coursename: course.courseName, // Add the courseName from the Course model
          iname: ins.name
        };
        //console.log(course.courseName)
        return courseData;
      })
    );

    //console.log('Available Courses:', availableCoursesWithNames);

    // Send the available courses as response
    res.status(200).json(availableCoursesWithNames);
  } catch (error) {
    console.error('Error fetching available courses:', error);
    res.status(500).json({ error: 'Error fetching available courses' });
  }
});

// Enroll in a Course
app.post('/api/enroll', async (req, res) => {
  const { email, courseId } = req.body;
  console.log('email', email , 'cid' , courseId);
  try {
    // Fetch the course to get the instructor's email
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const newRequest = new Enrollments({
      studentEmail: email,
      courseId : course.courseId,
      instructor: course.instructor, // Assuming this field exists in the Course model
      status: 'Instructor Approval Pending',
    });
    //console.log('check check ');
    await newRequest.save();
    res.json({ message: 'Enrollment request sent successfully' });
  } catch (error) {
    console.error('Error sending enrollment request:', error);
    res.status(500).json({ error: 'Error sending enrollment request' });
  }
});

app.patch('/api/enrollments/approveByInstructor', async (req, res) => {
  
  const { _id } = req.body;
  try {
    console.log('Approving enrollment with ID:', _id);
    const existingEnrollment = await Enrollments.findById(_id);

    if (!existingEnrollment) {
      console.log('No enrollment found with ID:', _id);
      return res.status(404).json({ error: 'Enrollment not found' });
    }
    let updateObject = {};

  if (existingEnrollment.status === 'Instructor Approval Pending') {
    updateObject = { status: 'Advisor Approval Pending' };
  }
  else{
    updateObject = { status: 'Enrolled' };
  }

  const updatedEnrollment = await Enrollments.findByIdAndUpdate(
    _id,
    updateObject, // Update the status conditionally
    { new: true } // Return the updated document
  );


    if (!updatedEnrollment) {
      console.log('No enrollment found with ID:', _id);
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    console.log('Enrollment approved:', updatedEnrollment);
    res.status(200).json(updatedEnrollment);
  } catch (error) {
    console.error('Error approving enrollment:', error);
    res.status(500).json({ error: 'Error approving enrollment' });
  }
});

app.patch('/api/enrollments/rejectByInstructor', async (req, res) => {
  
  const { _id } = req.body;
  try {
    console.log('Approving enrollment with ID:', _id);
    const existingEnrollment = await Enrollments.findById(_id);

    if (!existingEnrollment) {
      console.log('No enrollment found with ID:', _id);
      return res.status(404).json({ error: 'Enrollment not found' });
    }
    let updateObject = {};

  if (existingEnrollment.status === 'Instructor Approval Pending') {
    updateObject = { status: 'Instructor Rejected' };
  }
  else{
    updateObject = { status: 'Faculty Advisor Rejected' };
  }

  const updatedEnrollment = await Enrollments.findByIdAndUpdate(
    _id,
    updateObject, // Update the status conditionally
    { new: true } // Return the updated document
  );


    if (!updatedEnrollment) {
      console.log('No enrollment found with ID:', _id);
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    // console.log('Enrollment approved:', updatedEnrollment);
    res.status(200).json(updatedEnrollment);
  } catch (error) {
    console.error('Error approving enrollment:', error);
    res.status(500).json({ error: 'Error approving enrollment' });
  }
});

app.get('/api/enrollments/studentfind/:email', async (req, res) => {
  const  studentEmai  = req.params.email;
  console.log('Received email:', studentEmai);

  try { 
    console.log('Fetching enrollments for student:', studentEmai);

    const studentEnrollments = await Enrollments.find({ studentEmail: studentEmai })
    

    if (!studentEnrollments.length) {
      console.log('No enrollments found for student:', email);
      return res.status(404).json({ error: 'No enrollments found' });
    }

    const enrollmentsWithCname = await Promise.all(
      studentEnrollments.map(async (enrollment) => {
        const course = await Course.findOne({ courseId: enrollment.courseName });
        const ins = await UserData.findOne({email: enrollment.instructorEmail});
        // console.log(enrollment.courseName);
        // console.log(course.courseName); 
        return {
          ...enrollment.toObject(),
          cname: course.courseName, // Add cname field with courseName
          iname: ins.name
        };
      })
    );

    //console.log(enrollmentsWithCname);



    //console.log('Student Enrollments:', studentEnrollments);
    res.status(200).json(enrollmentsWithCname);
  } catch (error) {
    console.error('Error fetching enrollments for student:', error);
    res.status(500).json({ error: 'Error fetching enrollments' });
  }
});


// Server Listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
