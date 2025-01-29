const express = require('express');
const router = express.Router();
const {
  requestEnrollment,
  approveByInstructor,
  approveByAdvisor,
  dropBystudent,
} = require('../controllers/enrollmentController');

router.post('/request', requestEnrollment);

router.post('/approve/instructor', approveByInstructor);

router.post('/approve/advisor', approveByAdvisor);

router.patch('/drop', dropBystudent);

module.exports = router;
