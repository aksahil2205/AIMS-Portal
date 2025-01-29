// routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Route to create a user
router.post('/create', userController.createUser);

// Route to delete a user
router.delete('/delete/:email', userController.deleteUser);

// Route to update a user
router.put('/update/', userController.updateUser);

router.get('/name', userController.getUserName);

// Route to get users by role
router.get('/:role', userController.getUsersByRole);

router.get('studentAdvisor', userController.getStudentAdvisor);



module.exports = router;
