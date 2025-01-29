import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import InstructorDashboard from './pages/InstructorDashboard';
import AdvisorDashboard from './pages/AdvisorDashboard';
import AdminPage from './pages/AdminPage'; // Import AdminPage
import './App.css';

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [userType, setUserType] = useState(null);
  
//   useEffect(() => {
//     const authStatus = localStorage.getItem('isAuthenticated') === 'true';
//     const storedUserType = localStorage.getItem('userType');
//     console.log('Auth Status:', authStatus, 'User Type:', storedUserType);

//     if (authStatus === 'true' && storedUserType) {
//       setIsAuthenticated(true);
//       setUserType(storedUserType);
//     } else {
//       setIsAuthenticated(false); // Ensure false if no valid data found
//     }
//   }, []);

//   const authenticateUser = (status, role) => {
//     setIsAuthenticated(status);
//     setUserType(role);
//     localStorage.setItem('isAuthenticated', status);
//     localStorage.setItem('userType', role);
//   };

//   if (isAuthenticated === null) {
//     // Return a loading indicator or null while checking auth status
//     return <div>Loading...</div>;
//   }

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);  
  const [loading, setLoading] = useState(true); // To check if authentication status is loaded
  
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    const storedUserType = localStorage.getItem('userType');
    console.log('Auth Status:', authStatus, 'User Type:', storedUserType);

    setIsAuthenticated(authStatus);
    setUserType(storedUserType);

    setLoading(false);
  }, []);

  const authenticateUser = (status, role) => {
    setIsAuthenticated(status);
    setUserType(role);
    localStorage.setItem('isAuthenticated', status);
    localStorage.setItem('userType', role);
  };  

  if (loading) {
    return <div>Loading...</div>; // You can replace with a loading spinner if desired
  }


  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Default Route: Redirect based on authentication and role */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                userType === 'CourseInstructor' ? (
                  <Navigate to="/instructor" />
                ) : userType === 'Student' ? (
                  <Navigate to="/home" />
                ) : userType === 'FacultyAdvisor' ? (
                  <Navigate to="/advisor" />
                ) : userType === 'Admin' ? (
                  <Navigate to="/admin" />  // Redirect to Admin page
                ) : (
                  <Navigate to="/login" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Login Page */}
          <Route path="/login" element={<Login onAuthenticate={authenticateUser} />} />

          {/* Student Home Page */}
          <Route
            path="/home"
            element={isAuthenticated && userType === 'Student' ? <Home /> : <Navigate to="/login" />}
          />

          {/* Instructor Dashboard */}
          <Route
            path="/instructor"
            element={
              isAuthenticated && userType === 'CourseInstructor' ? <InstructorDashboard /> : <Navigate to="/login" />
            }
          />
          
          {/* Faculty Advisor Dashboard */}
          <Route
            path="/advisor"
            element={
              isAuthenticated && userType === 'FacultyAdvisor' ? <AdvisorDashboard /> : <Navigate to="/login" />
            }
          />

          {/* Admin Dashboard */}
          <Route
            path="/admin"
            element={
              isAuthenticated && userType === 'Admin' ? <AdminPage /> : <Navigate to="/login" />
            }
          />

          {/* Catch-all for unknown routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
