import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './aprq.css';

const ApproveRequests = ({ instructor, flag }) => {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        let response;
        if (flag === 1) {
          response = await axios.get(
            `http://localhost:5000/api/enrollments/instructor/${instructor}`
          );
        } else {
          response = await axios.get(
            `http://localhost:5000/api/enrollments/advisor/${instructor}`
          );
        }
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };
    fetchRequests();
  }, [instructor]);

  const handleApprove = async (_id) => {
    try {
      const response = await axios.patch('http://localhost:5000/api/enrollments/approveByInstructor', {
        _id,
      });
      setMessage(response.data.message);
      setRequests((prev) => prev.filter((req) => req._id !== _id)); // Remove approved request
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error approving request');
    }
  };

  const handleReject = async (_id) => {
    try {
      const response = await axios.patch('http://localhost:5000/api/enrollments/rejectByInstructor', {
        _id,
      });
      setMessage(response.data.message);
      setRequests((prev) => prev.filter((req) => req._id !== _id)); // Remove rejected request
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error rejecting request');
    }
  };

  // Filter requests based on the flag
  const filteredRequests = requests.filter((request) => {
    if (flag === 1) return request.status === 'Instructor Approval Pending';
    if (flag === 2) return request.status === 'Advisor Approval Pending';
    return false;
  });

  return (
    <div className="approve-requests-container">
      <h2 className="courses-title">Approve Student Requests</h2>

      {/* Display any messages */}
      {message && <p className="status-message">{message}</p>}

      {/* Check if there are no requests */}
      {filteredRequests.length === 0 ? (
        <p className="no-requests-message">No requests to approve</p>
      ) : (
        <div className="table-container">
          <table className="requests-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Student Email</th>
                <th>Course Name</th>
                <th>Course ID</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request._id}>
                  <td>{request.whoami}</td>
                  <td>{request.studentEmail}</td>
                  <td>{request.cname}</td>
                  <td>{request.courseName}</td>
                  <td>{request.status}</td>
                  <td>
                    <button
                      className="approve-button"
                      onClick={() => handleApprove(request._id)}
                    >
                      Approve
                    </button>
                    <button
                      className="reject-button"
                      onClick={() => handleReject(request._id)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ApproveRequests;
