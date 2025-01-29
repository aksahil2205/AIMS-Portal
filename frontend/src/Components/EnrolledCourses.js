import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ec.css';

const EnrolledCourses = ({ studentEmail }) => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/enrollments/studentfind/${studentEmail}`);
        setEnrolledCourses(response.data);
        console.log('API Response:', response.data);
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [studentEmail]);

  const handleDropCourse = async (_id) => {
    try {
      console.log('Dropping course with ID:', _id);
      const response = await axios.patch('http://localhost:5000/api/enrollments/drop', { enrollmentId: _id });
      setEnrolledCourses((prevCourses) =>
        prevCourses.map(course =>
          course._id === _id ? { ...course, status: 'Dropped by student' } : course
        )
      );

      console.log(response.data.courseName);
    } catch (error) {
      console.error('Error dropping course:', error);
    }
  };

  if (loading) {
    return <p>Loading enrolled courses...</p>;
  }

  return (
    <div className="available-courses-container">
      <h2 className="courses-title">Enrolled Courses</h2>
      {enrolledCourses.length === 0 ? (
        <p className="no-courses-message">No courses enrolled yet.</p>
      ) : (
        <table className="courses-table">
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Course Instructor</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {enrolledCourses.map((course) => (
              <tr key={course._id}>
                <td>{course.courseName}</td>
                <td>{course.cname || 'Unknown Course'}</td>
                <td>{course.iname}</td>
                <td>{course.status}</td>
                <td>
                  {course.status !== 'Instructor Rejected' &&
                    course.status !== 'Faculty Advisor Rejected' &&
                    course.status !== 'Rejected' &&
                    course.status !== 'Dropped by student' && (
                      <button
                        onClick={() => handleDropCourse(course._id)}
                        className="enroll-button"
                      >
                        Drop Course
                      </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EnrolledCourses;
