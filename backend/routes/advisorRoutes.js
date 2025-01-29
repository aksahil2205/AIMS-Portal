// routes/advisorRoutes.js
const express = require('express');
const advisorController = require('../controllers/advisorController');

const router = express.Router();

// Route to assign an advisor to a student
router.post('/assign', advisorController.assignAdvisor);

module.exports = router;
