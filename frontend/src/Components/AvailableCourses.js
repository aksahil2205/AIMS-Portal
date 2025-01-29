import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ec.css';

const AvailableCourses = ({ studentEmail }) => {
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvailableCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/available-courses', {
          params: { studentEmail },
        });
        //setAvailableCourses(response.data.availableCourses);
        //console.log('Available Courses Response:', response.data);
        setAvailableCourses(response.data);

      } catch (error) {
        console.error('Error fetching available courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableCourses();
  }, [studentEmail]);

  const handleEnrollmentRequest = async (courseId) => {
    try {
      const response = await axios.post('http://localhost:5000/api/enrollments/request', {
        studentEmail,
        courseId,
      });
      alert(response.data.message);
      // Refresh available courses
      setAvailableCourses((prevCourses) =>
        prevCourses.filter((course) => course._id !== courseId)
      );
    } catch (error) {
      console.error('Error requesting enrollment:', error);
      alert('Failed to request enrollment.');
    }
  };

  if (loading) {
    return <p>Loading available courses...</p>;
  }

  return (

    <div>
      
  <div className="available-courses-container">
  <h2 className="courses-title">AVAILABLE COURSES</h2>
  {availableCourses.length === 0 ? (
    <p className="no-courses-message">No courses available for enrollment.</p>
  ) : (
    <table className="courses-table">
      <thead>
        <tr>
          <th>Course ID</th>
          <th>Instructor</th>
          <th>Course Name</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {availableCourses.map((course) => (
          <tr key={course._id}>
            <td>{course.courseId}</td>
            <td>{course.iname}</td>
            <td>{course.coursename}</td>
            <td>
              <button
                className="enroll-button"
                onClick={() => handleEnrollmentRequest(course._id)}
              >
                Request Enrollment
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>

</div>
  );
};

export default AvailableCourses;
