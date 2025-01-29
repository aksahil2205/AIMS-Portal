import React, { useState } from 'react';
import axios from 'axios';
import './ass.css';

const AssignAdvisor = ({ students, advisors, fetchUsers }) => {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedAdvisor, setSelectedAdvisor] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAssignAdvisor = async () => {
    if (!selectedStudent || !selectedAdvisor) {
      alert('Please select both a student and an advisor.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:5000/admin/advisors/assign', {
        studentEmail: selectedStudent,
        advisorEmail: selectedAdvisor,
      });
      fetchUsers();
      alert('Advisor assigned successfully');
    } catch (err) {
      setError('Error assigning advisor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="assign-advisor-container">
      <h3 className="assign-advisor-title">Assign Advisor</h3>

      {error && <p className="error-message">{error}</p>}

      <hr className="divider" />

      <div>
        <label htmlFor="student" className="form-label">
          Select Student:
        </label>
        <select
          id="student"
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          className="select-field"
        >
          <option value="">Select a Student</option>
          {students.map((student) => (
            <option key={student.email} value={student.email}>
              {student.email}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="advisor" className="form-label">
          Select Advisor:
        </label>
        <select
          id="advisor"
          value={selectedAdvisor}
          onChange={(e) => setSelectedAdvisor(e.target.value)}
          className="select-field"
        >
          <option value="">Select an Advisor</option>
          {advisors.map((advisor) => (
            <option key={advisor.email} value={advisor.email}>
              {advisor.email}
            </option>
          ))}
        </select>
      </div>

      <div className="assign-button-container">
        <button
          onClick={handleAssignAdvisor}
          disabled={loading}
          className="assign-button"
        >
          {loading ? 'Assigning...' : 'Assign Advisor'}
        </button>
      </div>

      <hr className="divider" />

      <div className="table-container">
        <h4 className="table-title">Students and Their Assigned Advisors:</h4>
        {students.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Student Email</th>
                <th>Assigned Advisor</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.email}>
                  <td>{student.email}</td>
                  <td>{student.advisorEmail || 'No advisor assigned'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-data">No students available.</p>
        )}
      </div>
    </div>
  );
};

export default AssignAdvisor;
