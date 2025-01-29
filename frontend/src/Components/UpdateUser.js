import React, { useState } from 'react';
import axios from 'axios';

const UpdateUser = ({ user, fetchUsers }) => {
  const [email, setEmail] = useState(user.email);

  const handleUpdate = async () => {
    try {
      // Sending the user._id along with the updated email and role
      await axios.put(`http://localhost:5000/admin/users/update`, { 
        _id: user._id, // Pass the _id of the user to be updated
        email: email, // Pass the updated email
        role: user.role // Pass the updated role
      });
  
      alert('User updated successfully');
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error updating user:', error); // Log the error for debugging
      alert('Error updating user');
    }
  };
  

  return (
      <div>
         <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Update Email"
          style={{
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            fontSize: '16px',
            outline: 'none',
            transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
            width: '200px',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#3498db';
            e.target.style.boxShadow = '0 0 5px rgba(52, 152, 219, 0.5)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#ccc';
            e.target.style.boxShadow = 'none';
          }}
  />
        &nbsp;
        <button onClick={handleUpdate}>Update</button>
      </div>
  );
};

export default UpdateUser;
