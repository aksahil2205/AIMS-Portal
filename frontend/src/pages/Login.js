import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';
import Header from '../Components/Header';

const Login = ({ onAuthenticate }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [role, setRole] = useState(''); 
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const sendOtp = async () => {
    if (!email.includes('@')) {
      setMessage('Please enter a valid email address');
      return;
    }
    if (!role) {
      setMessage('Please select a role');
      return;
    }

    setIsLoading(true);
    try {
      let role2;
      if (role === 'CourseInstructor') {
        role2 = 'instructor';
      } else if (role === 'FacultyAdvisor') {
        role2 = 'faculty advisor';
      } else if (role === 'Student') {
        role2 = 'student';
      } else if (role === 'Admin') {
        role2 = 'admin';  
      }
      const response = await axios.post('http://localhost:5000/api/login', { email, role:role2 });
      setMessage(response.data.message);
      setIsOtpSent(true);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error sending OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) {
      setMessage('OTP must be 6 digits');
      return;
    }

    setIsLoading(true);
    try {
      const defaultotp=123456;
      const response = await axios.post('http://localhost:5000/api/verify', { email, otp, role, defaultotp });
      if (response.data.success) {
        localStorage.setItem('isAuthenticated', 'true'); 
        onAuthenticate(true, role);

        localStorage.setItem('userType', role); 
        localStorage.setItem('userEmail', email);

        if (role === 'CourseInstructor') {
          navigate('/instructor');
        } else if (role === 'FacultyAdvisor') {
          navigate('/advisor');
        } else if (role === 'Student') {
          navigate('/home');
        } else if (role === 'Admin') {
          navigate('/admin');  // Navigate to admin page if role is 'Admin'
        }
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error verifying OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="login-container">
        <h2 className="login-heading">LOGIN</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
        />
        <br />
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="select-field"
        >
          <option value="">Login as</option>
          <option value="Student">Student</option>
          <option value="CourseInstructor">Instructor</option>
          <option value="FacultyAdvisor">Faculty Advisor</option>
          <option value="Admin">Admin</option>  {/* Added Admin option */}
        </select>
        <br /><br />
        {isOtpSent && (
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="input-field"
          />
        )}
        <br />
        {!isOtpSent ? (
          <button onClick={sendOtp} disabled={isLoading} className="button">
            {isLoading ? 'Sending...' : 'Send OTP'}
          </button>
        ) : (
          <button onClick={verifyOtp} disabled={isLoading} className="button">
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
        )}
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
