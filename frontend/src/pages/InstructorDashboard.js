import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddCourse from '../Components/AddCourse';
import ApproveRequests from '../Components/ApproveRequests';
import axios from 'axios'; // For API requests
import Inspage from '../Components/inspage';

const InstructorDashboard = () => {
  const [activeTab, setActiveTab] = useState('inspage');
  const [instructorName, setInstructorName] = useState(''); // State to store the instructor's name
  const instructorEmail = localStorage.getItem('userEmail'); // Fetch logged-in instructor email
  const instructor = localStorage.getItem('userEmail'); // Fetch logged-in instructor email
  const navigate = useNavigate();

  const checkAuthentication = () => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userRole = localStorage.getItem('userType');
    if (!isAuthenticated || userRole !== 'CourseInstructor') {
      navigate('/login');
    }
  };

  useEffect(() => {
    checkAuthentication(); // Check authentication on component mount
    const fetchInstructorName = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/users/name', {
          params: { email: instructorEmail }, // Send email as query parameter
        });
        setInstructorName(response.data.name); // Set the instructor's name in state
      } catch (error) {
        console.error('Error fetching instructor details:', error);
        navigate('/login'); // Redirect to login if error occurs
      }
    };

    fetchInstructorName();
  }, [instructorEmail, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    navigate('/login'); // Redirect to login page
  };

  return (
    <div>
      <h1>WELCOME {instructorName || 'INSTRUCTOR'}</h1>
      <div>
        <style>
          {`
            .dashboard-container {
                font-family: 'Segoe UI', Tahoma, sans-serif;
                padding: 20px;
                background-color: #edf7ed;
                border-radius: 10px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                text-align: center;
                max-width: 1200px;
                margin: 50px auto;
              }
  
            .menu-bar {
              display: flex;
              justify-content: center;
              background-color: #edf7ed; /* Very light green */
              padding: 0px 0px;
              border-radius: 0px;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Light shadow */
            }

            .menu-button {
              color: #2e6b2e; /* Dark green for text */
              background-color: transparent;
              border: none;
              padding: 15px 30px;
              font-size: 18px;
              cursor: pointer;
              transition: background-color 0.3s ease, transform 0.2s ease;
              font-weight: 500;
            }

            .menu-button:hover {
              background-color: #a3d9a3; /* Light green for hover effect */
              transform: scale(1.03); /* Subtle scaling effect */
            }

            .menu-button.active {
              background-color: #66bb6a; /* Soft green for active state */
              border-radius: 5px;
            }

            .logout-container {
              margin-left: auto;
              padding : 0px 0px;
            }

            .logout-button {
              color: white;
              background-color: #f67272; /* Soft red for logout */
              border: none;
              padding: 17px 30px;
              font-size: 15px;
              cursor: pointer;
              border-radius: 5px;
              transition: background-color 0.3s ease, transform 0.2s ease;
              font-weight: 500;
            }

            .logout-button:hover {
              background-color: #e15656; /* Darker red for hover */
              transform: scale(1.03);
            }

            h1 {
              font-family: 'Segoe UI', Tahoma, sans-serif;
              color: #2e6b2e; /* Dark green for the title */
              font-weight: 600;
              text-align: center;
              margin-top: 30px;
            }
          `}
        </style>

        <div className="menu-bar">
          <button 
            className={`menu-button ${activeTab === 'inspage' ? 'active' : ''}`} 
            onClick={() => setActiveTab('inspage')}
          >
            HomePage
          </button>
          <button 
            className={`menu-button ${activeTab === 'addCourse' ? 'active' : ''}`} 
            onClick={() => setActiveTab('addCourse')}
          >
            Add Courses
          </button>
          <button 
            className={`menu-button ${activeTab === 'approveRequests' ? 'active' : ''}`} 
            onClick={() => setActiveTab('approveRequests')}
          >
            Approve Requests
          </button>
          <div className="logout-container">
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-container">
        {activeTab === 'inspage' && <Inspage />}
        {activeTab === 'addCourse' && <AddCourse instructor={instructorEmail} />}
        {activeTab === 'approveRequests' && <ApproveRequests instructor={instructorEmail} flag={1} />}
      </div>
    </div>
  );
};

export default InstructorDashboard;
