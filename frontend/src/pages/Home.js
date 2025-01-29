import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EnrolledCourses from '../Components/EnrolledCourses';
import AvailableCourses from '../Components/AvailableCourses';
import axios from 'axios'; // For API requests
import Homepage from '../Components/homepage';

const Home = () => {
  const navigate = useNavigate();
  const studentEmail = localStorage.getItem('userEmail');
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userType = localStorage.getItem('userType');
  
  const [activeTab, setActiveTab] = useState('homepage'); // Default to 'homepage'
  const [studentName, setStudentName] = useState(''); // State to store the student's name

  useEffect(() => {
    if (!isAuthenticated || userType !== 'Student') {
      navigate('/login'); // Redirect to login if not authenticated or role is invalid
    } else {
      // Fetch user details
      const fetchUserDetails = async () => {
        try {
          console.log('Request sent');
          const response = await axios.get('http://localhost:5000/admin/users/name', {
            params: { email: studentEmail }, // Pass the email as a query parameter
          });
          console.log(response.data.name);
          setStudentName(response.data.name); // Update state with the student's name
        } catch (error) {
          console.error('Error fetching user details:', error);
          navigate('/login'); // Redirect to login on error
        }
      };

      fetchUserDetails();
    }
  }, [isAuthenticated, userType, navigate, studentEmail]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated'); 
    localStorage.removeItem('userEmail'); 
    navigate('/login'); 
  };

  const handleTabSwitch = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div>
      <style>
        {`
          body {
            background-color: #f9f9f9; /* Light background for the entire app */
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
          }

          .tabs-container {
            display: flex;
            align-items: center;
            background-color: #ffffff; /* Light background for the tab container */
            padding: 0 10px;
            border-radius: 8px;
            max-width: 100%;
            margin: 20px auto;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Soft shadow for depth */
          }

          .tab-button {
            background-color: transparent;
            color: #2c3e50; /* Dark text for a professional look */
            border: none;
            font-size: 16px;
            padding: 12px 25px;
            cursor: pointer;
            transition: background-color 0.3s ease, color 0.3s ease;
            font-weight: 500;
          }

          .tab-button:hover {
            background-color: #e8f5e9; /* Light green background on hover */
            color: #2ecc71; /* Green text on hover */
            border-radius: 6px;
          }

          .active-tab {
            background-color: #2ecc71; /* Green for the active tab */
            color: white;
            border-radius: 6px;
          }

          .logout-container {
            margin-left: auto;
            padding: 0 10px;
          }

          .logout-button {
            background-color: #e74c3c; /* Bright red for the logout button */
            color: white;
            border: none;
            font-size: 16px;
            padding: 12px 25px;
            cursor: pointer;
            border-radius: 6px;
            transition: background-color 0.3s ease, transform 0.2s ease;
          }

          .logout-button:hover {
            background-color: #c0392b; /* Darker red for hover state */
            transform: scale(1.02);
          }

          h1 {
            color: #2c3e50; /* Professional dark text */
            text-align: center;
            margin-top: 20px;
          }

          .tab-content {
            margin: 20px;
            padding: 20px;
            background-color: #ffffff; /* White background for the content */
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Add a shadow for depth */
          }

          /* Responsiveness for smaller screens */
          @media (max-width: 768px) {
            .tab-button, .logout-button {
              font-size: 14px;
              padding: 10px 20px;
            }

            .tabs-container {
              flex-wrap: wrap;
              padding: 10px;
            }
          }
        `}
      </style>
      <div>
        <h1>Welcome, {studentName || 'Student'}!</h1> {/* Display student's name or a fallback */}
        {/* Tabs */}
        <div className="tabs-container">
          <button 
            className={`tab-button ${activeTab === 'homepage' ? 'active-tab' : ''}`}
            onClick={() => handleTabSwitch('homepage')}>
            HomePage
          </button>
          <button
            className={`tab-button ${activeTab === 'enrolled' ? 'active-tab' : ''}`}
            onClick={() => handleTabSwitch('enrolled')}
          >
            Enrolled Courses
          </button>
          <button
            className={`tab-button ${activeTab === 'available' ? 'active-tab' : ''}`}
            onClick={() => handleTabSwitch('available')}
          >
            Available Courses
          </button>
          <div className="logout-container">
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
        <div className="tab-content">
          {activeTab === 'homepage' && <Homepage />}
          {activeTab === 'enrolled' && <EnrolledCourses studentEmail={studentEmail} />}
          {activeTab === 'available' && <AvailableCourses studentEmail={studentEmail} />}
        </div>
      </div>
    </div>
  );
};

export default Home;
