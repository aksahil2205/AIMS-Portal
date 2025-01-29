const express = require('express');
const router = express.Router();
const { getAllCourses, addCourse, getCoursesByInstructor } = require('../controllers/courseController');

router.get('/', getAllCourses);
router.post('/add', addCourse);
router.get('/instructor/:instructor', getCoursesByInstructor);

module.exports = router;
