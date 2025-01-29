import React, { useState } from 'react';
import axios from 'axios';
import './cl.css';

const CreateUser = ({ fetchUsers, role }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleCreate = async () => {
    if (!name.trim() || !email.trim()) {
      setError('Both name and email are required.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/admin/users/create', { name, email, role });
      alert(`${role.charAt(0).toUpperCase() + role.slice(1)} created successfully!`);
      fetchUsers(); // Re-fetch users to update the list
      setName(''); // Clear inputs
      setEmail('');
      setError(''); // Clear any existing error
    } catch (error) {
      console.error('Error creating user:', error);
      setError('Failed to create user. Please try again.');
    }
  };

  return (
    <div className="create-user-card">
      <h2 className="create-user-title">Create {role.charAt(0).toUpperCase() + role.slice(1)}</h2>
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={`Enter ${role} name`}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={`Enter ${role} email`}
          className="form-input"
        />
      </div>
      {error && <p className="error-message">{error}</p>}
      <button onClick={handleCreate} className="create-button">
        Create {role.charAt(0).toUpperCase() + role.slice(1)}
      </button>
    </div>
  );
};

export default CreateUser;
