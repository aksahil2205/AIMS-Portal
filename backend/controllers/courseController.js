const Course = require('../models/courseModel');


const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();     
    //console.log('Fetched Courses:',courses);
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses' });
  }
};


const addCourse = async (req, res) => {
  const { courseId,courseName,  instructor } = req.body; 
  //console.log(req.body);

  try {
    
    const existingCourse = await Course.findOne({ courseId });
    if (existingCourse) {
      return res.status(400).json({ message: 'Course ID already exists' });
    }    
    const course = new Course({ courseId, courseName, instructor });    
    await course.save();
    res.status(201).json({ message: 'Course added successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Error adding course' });
  }
};


const getCoursesByInstructor = async (req, res) => {
  const { instructor } = req.params; 
  try {
    const courses = await Course.find({ instructor }); 
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses for instructor' });
  }
};

module.exports = { getAllCourses, addCourse, getCoursesByInstructor };
