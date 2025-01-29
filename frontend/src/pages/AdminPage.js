import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserList from '../Components/UserList';
import CreateUser from '../Components/CreateUser';
import AssignAdvisor from '../Components/AssignAdvisor';
import Adpage from '../Components/adpage';
import './am.css';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('adpage');
  const [students, setStudents] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [advisors, setAdvisors] = useState([]);
  const navigate = useNavigate();
  const admin = localStorage.getItem('userEmail');
  const userRole = localStorage.getItem('userType');

  useEffect(() => {
    if (!localStorage.getItem('isAuthenticated') || userRole !== 'Admin') {
      navigate('/login'); // Redirect to login page if not authenticated or wrong role
    }
  }, [navigate, userRole]);

  // Base URL for the backend server
  const BASE_URL = 'http://localhost:5000';

  // Fetch data based on the active tab
  const fetchUsers = async () => {
    try {
      if (activeTab === 'students' || activeTab === 'assignAdvisor') {
        const response = await axios.get(`${BASE_URL}/admin/users/student`); // Endpoint for students
        setStudents(response.data);
      } else if (activeTab === 'instructors') {
        const response = await axios.get(`${BASE_URL}/admin/users/instructor`); // Endpoint for instructors
        setInstructors(response.data);
      } else if (activeTab === 'advisors') {
        const response = await axios.get(`${BASE_URL}/admin/users/faculty advisor`); // Endpoint for advisors
        setAdvisors(response.data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  // Fetch data when the component mounts or when activeTab changes
  useEffect(() => {
    fetchUsers();
  }, [activeTab]);

  // Logout function
  const handleLogout = async () => {
    try {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userType');
      localStorage.removeItem('userEmail');
      navigate('/login'); // Redirect to login page
    } catch (err) {
      console.error('Error logging out:', err);
      alert('Failed to log out. Please try again.');
    }
  };

  return (
    <div>
      <h1 className="dashboard-header">ADMIN DASHBOARD</h1>
    <div className="dashboard-container">
      <div className="menu-bar">
        <div className="left-menu">
          <button onClick={() => setActiveTab('adpage')} className="menu-button">HomePage</button>
          <button onClick={() => setActiveTab('students')} className="menu-button">Students</button>
          <button onClick={() => setActiveTab('instructors')} className="menu-button">Instructors</button>
          <button onClick={() => setActiveTab('advisors')} className="menu-button">Advisors</button>
          <button onClick={() => setActiveTab('assignAdvisor')} className="menu-button">Assign Advisor</button>
        </div>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      <div className = "dashboard-container">
        {activeTab === 'adpage' && <Adpage />}
        {activeTab === 'students' && (
          <>
            <CreateUser fetchUsers={fetchUsers} role="student" />
            <UserList users={students} role="student" fetchUsers={fetchUsers} />
          </>
        )}

        {activeTab === 'instructors' && (
          <>
            <CreateUser fetchUsers={fetchUsers} role="instructor" />
            <UserList users={instructors} role="instructor" fetchUsers={fetchUsers} />
          </>
        )}

        {activeTab === 'advisors' && (
          <>
            <CreateUser fetchUsers={fetchUsers} role="faculty advisor" />
            <UserList users={advisors} role="faculty advisor" fetchUsers={fetchUsers} />
          </>
        )}

        {activeTab === 'assignAdvisor' && (
          <AssignAdvisor students={students} advisors={advisors} fetchUsers={fetchUsers} />
        )}
      </div>
    </div>
    </div>
  );
};

export default AdminPage;
