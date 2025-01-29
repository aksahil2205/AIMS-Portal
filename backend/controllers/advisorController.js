// controllers/advisorController.js
const Advisor = require('../models/advisorModel');
const UserData = require('../models/userDataModel');

// Assign an advisor to a student
exports.assignAdvisor = async (req, res) => {
  const { studentEmail, advisorEmail } = req.body;

  if (!studentEmail || !advisorEmail) {
    return res.status(400).json({ message: 'Student and advisor emails are required' });
  }

  try {
    console.log(`Assigning Advisor: ${advisorEmail} to Student: ${studentEmail}`);

    // Fetch student and advisor concurrently
    const [student, advisor] = await Promise.all([
      UserData.findOne({ email: studentEmail, role: 'student' }),
      UserData.findOne({ email: advisorEmail, role: 'faculty advisor' }),
    ]);

    if (!student || !advisor) {
      return res.status(404).json({ message: 'Student or Advisor not found' });
    }

    // Check if the student already has an assigned advisor
    const existingAssignment = await Advisor.findOne({ studentEmail });

    if (existingAssignment) {
      // Update the existing advisor assignment
      existingAssignment.advisorEmail = advisorEmail;
      await existingAssignment.save();
      return res.status(200).json({ message: 'Advisor re-assigned successfully' });
    }

    // Create a new advisor-student relationship
    const newAssignment = new Advisor({ studentEmail, advisorEmail });
    await newAssignment.save();

    res.status(201).json({ message: 'Advisor assigned successfully' });
  } catch (error) {
    console.error('Error assigning advisor:', error);
    res.status(500).json({ message: 'Error assigning advisor' });
  }
};
