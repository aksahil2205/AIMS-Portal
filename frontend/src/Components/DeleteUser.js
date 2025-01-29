import React from 'react';
import axios from 'axios';

const DeleteUser = ({ user, fetchUsers }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/admin/users/delete/${user.email}`);
      //await axios.delete(`http://localhost:5000/admin/users/delete`);
      alert('User deleted successfully');
      fetchUsers();
    } catch (error) {
      alert('Error deleting user');
    }
  };

  return (
    <div
    style={{
      padding: '5px',
    }}>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default DeleteUser;
