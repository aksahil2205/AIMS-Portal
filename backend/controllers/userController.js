// controllers/userController.js
const UserData = require('../models/userDataModel');
const Advisor = require('../models/advisorModel');  // Assuming Advisor model is already set up


// Create a new user
exports.createUser = async (req, res) => {
  const { email, role, name } = req.body;
  try {
    const newUser = new UserData({ email, role, name });
     // Replace with your default advisor email
    if(role=='student'){
      console.log('stduent')
      const defaultAdvisorEmail = 'defaultadvisor@iitrpr.ac.in';
      const newAssignAdvisor=new Advisor({studentEmail:email, advisorEmail:defaultAdvisorEmail});
      await newAssignAdvisor.save();
    }
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user' });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  const { email } = req.params;
  const defaultAdvisorEmail = 'defaultadvisor@iitrpr.ac.in'; // Replace with your default advisor email

  try {
    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if the user exists
    const user = await UserData.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'faculty advisor') {
      // If the user is a faculty advisor, reassign their students to the default advisor
      await Advisor.updateMany(
        { advisorEmail: email }, // Find all records with this advisor
        { $set: { advisorEmail: defaultAdvisorEmail } } // Reassign to default advisor
      );
      console.log(`Students of ${email} reassigned to ${defaultAdvisorEmail}`);
    }

    // Delete the user
    await UserData.deleteOne({ email });

    res.status(200).json({
      message:
        user.role === 'faculty advisor'
          ? `Faculty advisor ${email} deleted and students reassigned to ${defaultAdvisorEmail}`
          : `User with email ${email} deleted successfully`,
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  const { _id, email, role } = req.body; // Get the _id, email, and role from the request body
  console.log(email)
  const User = await UserData.findById(_id)
  console.log(User.email)
  // Ensure all required fields are provided
  if (!_id || !email || !role) {
    return res.status(400).json({ message: 'Missing required fields (_id, email, or role)' });
  }

  try {
    // Use _id to find and update the user
    const updatedUser = await UserData.findByIdAndUpdate(
      _id, // Use _id as the identifier
      { email, role }, // Update the email and role
      { new: true } // Ensure the updated document is returned
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Successfully updated user
    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error during update:', error);  // Log the full error
    res.status(500).json({ message: 'Error updating user' });
  }
};


// Get all users by role
exports.getUsersByRole = async (req, res) => {
  const { role } = req.params;
  
  try {
    // Step 1: Fetch all users by role
    const users = await UserData.find({ role });

    // Step 2: If role is 'student', we will fetch the advisor details from the Advisor collection
    if (role === 'student') {
      // Fetch advisor mapping for the students
      const advisors = await Advisor.find();

      // Map advisor email to each student
      const usersWithAdvisor = users.map((user) => {
        const advisor = advisors.find((advisor) => advisor.studentEmail === user.email);
        return {
          ...user.toObject(),
          advisorEmail: advisor ? advisor.advisorEmail : null,  // If no advisor, set it as null
        };
      });

      // Step 3: Send the updated user list with advisor info
      res.status(200).json(usersWithAdvisor);
    } else {
      // If the role is not 'student', just return the users as usual
      res.status(200).json(users);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};


exports.getStudentAdvisor = async (req, res) => {
  const { role } = req.params;
  
  try {
    // Step 1: Fetch all users by role
    const users = await UserData.find({ role });

    // Step 2: If role is 'student', we will fetch the advisor details from the Advisor collection
    if (role === 'student') {
      // Fetch advisor mapping for the students
      console.log('hello')
      const advisors = await Advisor.find();

      // Map advisor email to each student
      const usersWithAdvisor = users.map((user) => {
        const advisor = advisors.find((advisor) => advisor.studentEmail === user.email);
        console.log(advisor)
        return {
          ...user.toObject(),
          advisorEmail: advisor ? advisor.advisorEmail : null,  // If no advisor, set it as null
        };
      });

      // Step 3: Send the updated user list with advisor info
      res.status(200).json(usersWithAdvisor);
    } else {
      // If the role is not 'student', just return the users as usual
      res.status(200).json(users);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};


// Endpoint to retrieve user name by email
exports.getUserName = async (req, res) => {
  try {
    console.log('heql')
    const { email } = req.query; // Use query parameters instead of params
    console.log(email)
    console.log('hey')

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find user by email
    const user = await UserData.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return user name
    res.json({ name: user.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
