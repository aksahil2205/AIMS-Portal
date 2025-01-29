import React, { useState } from 'react';
import axios from 'axios';

const AddCourse = ({ instructor }) => {
  const [courseId, setCourseId] = useState('');
  const [courseName, setCourseName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/courses/add', {
        courseId,
        courseName,
        instructor,
      });
      setMessage(response.data.message);
      setCourseId(''); // Clear the input fields
      setCourseName('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error adding course');
    }
  };

  return (
    <div>
      <style>
        {`
          .add-course-container {
            width: 400px;
            margin: 50px auto;
            padding: 30px;
            background-color: #edf7ed; /* Light green background */
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            text-align: center;
            font-family: Arial, sans-serif;
          }

          .form-title {
            font-size: 28px;
            margin-bottom: 20px;
            color: #2e6b2e; /* Dark green for title */
            font-weight: 600;
          }

          .form-group {
            margin-bottom: 20px;
            text-align: left;
          }

          .form-label {
            display: block;
            font-size: 18px;
            margin-bottom: 5px;
            color: #555;
          }

          .form-input {
            width: 90%;
            padding: 10px;
            font-size: 16px;
            border: 1px solid #ccc;
            border-radius: 5px;
            transition: border-color 0.3s ease;
          }

          .form-input:focus {
            border-color: #66bb6a; /* Green on focus */
            outline: none;
          }

          .submit-button {
            width: 100%;
            padding: 12px;
            background-color: #66bb6a; /* Soft green button */
            color: white;
            font-size: 18px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }

          .submit-button:hover {
            background-color: #4caf50; /* Darker green for hover */
          }

          .form-message {
            margin-top: 20px;
            font-size: 16px;
            color: #2e6b2e; /* Dark green for messages */
          }
        `}
      </style>
      <div className="add-course-container">
        <h2 className="form-title">Add Course</h2>
        <form onSubmit={handleSubmit} className="add-course-form">
          <div className="form-group">
            <label className="form-label">Course ID:</label>
            <input
              type="text"
              className="form-input"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Course Name:</label>
            <input
              type="text"
              className="form-input"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-button">Add Course</button>
        </form>
        {message && <p className="form-message">{message}</p>}
      </div>
    </div>
  );
};

export default AddCourse;
