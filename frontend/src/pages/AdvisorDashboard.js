import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApproveRequests from '../Components/ApproveRequests';
import Advpage from '../Components/advpage';
import axios from 'axios';
import './ad.css';

const AdvisorDashboard = () => {
  const [activeTab, setActiveTab] = useState('advpage');
  const [advisorName, setAdvisorName] = useState('');
  const advisorEmail = localStorage.getItem('userEmail');
  const advisor = localStorage.getItem('userEmail');
  const userRole = localStorage.getItem('userType');
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('isAuthenticated') || userRole !== 'FacultyAdvisor') {
      navigate('/login');
    }

    const fetchAdvisorName = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/users/name', {
          params: { email: advisorEmail },
        });
        setAdvisorName(response.data.name);
      } catch (error) {
        console.error('Error fetching advisor details:', error);
        navigate('/login');
      }
    };
    fetchAdvisorName();
  }, [advisorEmail, navigate, userRole]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  return (
    <div>
      <h1 className="dashboard-header">WELCOME {advisorName || 'FACULTY ADVISOR'}</h1>
    <div className= "dashboard-container">
      <div>
        <div className="menu-bar">
          <div className="left-menu">
            <button
              className={`menu-button ${activeTab === 'advpage' ? 'active' : ''}`}
              onClick={() => setActiveTab('advpage')}
            >
              Homepage
            </button>
            <button
              className={`menu-button ${activeTab === 'approveRequest' ? 'active' : ''}`}
              onClick={() => setActiveTab('approveRequest')}
            >
              Approve Requests
            </button>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
      <div className = "dashboard-container">

        {activeTab === 'advpage' && <Advpage />}
        {activeTab === 'approveRequest' && <ApproveRequests instructor={advisor} flag={2} />}
      </div>
    </div>
    </div>
  );
};

export default AdvisorDashboard;
