import React from 'react';
import UpdateUser from './UpdateUser';
import DeleteUser from './DeleteUser';
import './list.css';

const UserList = ({ users, role, fetchUsers }) => {
  return (
    <div className="user-list-card">
      <h2 className="user-list-title">{role.charAt(0).toUpperCase() + role.slice(1)} List</h2>
      <div className="table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <div className="actions">
                      <UpdateUser user={user} fetchUsers={fetchUsers} />
                      <DeleteUser user={user} fetchUsers={fetchUsers} />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="no-data">
                  No {role}s found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
