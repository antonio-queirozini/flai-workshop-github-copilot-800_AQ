import React, { useState, useEffect } from 'react';

function Users() {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    age: '',
    fitness_level: 'beginner'
  });
  const [selectedTeams, setSelectedTeams] = useState([]);

  const getApiUrl = (endpoint) => {
    const codespace = process.env.REACT_APP_CODESPACE_NAME;
    return codespace 
      ? `https://${codespace}-8000.app.github.dev/api/${endpoint}/`
      : `http://localhost:8000/api/${endpoint}/`;
  };

  const fetchUsers = () => {
    const apiUrl = getApiUrl('users');
    console.log('Users API endpoint:', apiUrl);

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Users fetched data:', data);
        const usersData = data.results || data;
        setUsers(Array.isArray(usersData) ? usersData : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        setError(error.message);
        setLoading(false);
      });
  };

  const fetchTeams = () => {
    const apiUrl = getApiUrl('teams');
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        console.log('Teams fetched data:', data);
        const teamsData = data.results || data;
        setTeams(Array.isArray(teamsData) ? teamsData : []);
      })
      .catch(error => {
        console.error('Error fetching teams:', error);
      });
  };

  useEffect(() => {
    fetchUsers();
    fetchTeams();
  }, []);

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username || '',
      email: user.email || '',
      age: user.age || '',
      fitness_level: user.fitness_level || 'beginner'
    });
    
    // Get user's current teams
    const userTeams = teams.filter(team => 
      team.members && team.members.some(member => member.id === user.id)
    );
    setSelectedTeams(userTeams.map(team => team.id));
    
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({
      username: '',
      email: '',
      age: '',
      fitness_level: 'beginner'
    });
    setSelectedTeams([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTeamToggle = (teamId) => {
    setSelectedTeams(prev => {
      if (prev.includes(teamId)) {
        return prev.filter(id => id !== teamId);
      } else {
        return [...prev, teamId];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const apiUrl = getApiUrl(`users/${editingUser.id}`);
    
    try {
      // Use PATCH for partial updates instead of PUT
      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          age: parseInt(formData.age) || 0,
          fitness_level: formData.fitness_level
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Update error:', errorData);
        throw new Error(errorData.detail || 'Failed to update user');
      }

      const updatedUser = await response.json();
      console.log('User updated successfully:', updatedUser);

      // Update teams membership
      for (const team of teams) {
        const teamApiUrl = getApiUrl(`teams/${team.id}`);
        const shouldBeInTeam = selectedTeams.includes(team.id);
        const isInTeam = team.members && team.members.some(member => member.id === editingUser.id);

        if (shouldBeInTeam && !isInTeam) {
          // Add user to team
          const memberIds = team.members ? team.members.map(m => m.id) : [];
          await fetch(teamApiUrl, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              member_ids: [...memberIds, editingUser.id]
            })
          });
        } else if (!shouldBeInTeam && isInTeam) {
          // Remove user from team
          const memberIds = team.members.filter(m => m.id !== editingUser.id).map(m => m.id);
          await fetch(teamApiUrl, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              member_ids: memberIds
            })
          });
        }
      }

      handleClose();
      fetchUsers();
      fetchTeams();
    } catch (error) {
      console.error('Error updating user:', error);
      alert(`Failed to update user: ${error.message}`);
    }
  };

  const getUserTeams = (userId) => {
    return teams.filter(team => 
      team.members && team.members.some(member => member.id === userId)
    );
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading users...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading Users</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="page-header text-center">
        <h2>👤 Users</h2>
        <p className="mb-0">All registered users and their profiles</p>
      </div>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Username</th>
              <th scope="col">Email</th>
              <th scope="col">Age</th>
              <th scope="col">Fitness Level</th>
              <th scope="col">Teams</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map(user => {
                const userTeams = getUserTeams(user.id);
                return (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td><strong>{user.username}</strong></td>
                    <td>{user.email}</td>
                    <td>{user.age}</td>
                    <td>
                      <span className={`badge ${
                        user.fitness_level === 'advanced' ? 'bg-danger' :
                        user.fitness_level === 'intermediate' ? 'bg-warning' :
                        'bg-success'
                      }`}>
                        {user.fitness_level ? user.fitness_level.charAt(0).toUpperCase() + user.fitness_level.slice(1) : 'Beginner'}
                      </span>
                    </td>
                    <td>
                      {userTeams.length > 0 ? (
                        <div className="d-flex flex-wrap gap-1">
                          {userTeams.map(team => (
                            <span key={team.id} className="badge bg-info text-dark">
                              {team.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted">No teams</span>
                      )}
                    </td>
                    <td>
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => handleEdit(user)}
                      >
                        ✏️ Edit
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-muted py-4">
                  <i>No users found</i>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit User Modal */}
      {showModal && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}} onClick={handleClose}>
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white'}}>
                <h5 className="modal-title">Edit User: {editingUser?.username}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={handleClose}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="age" className="form-label">Age</label>
                    <input
                      type="number"
                      className="form-control"
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      min="0"
                      max="120"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="fitness_level" className="form-label">Fitness Level</label>
                    <select
                      className="form-select"
                      id="fitness_level"
                      name="fitness_level"
                      value={formData.fitness_level}
                      onChange={handleInputChange}
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Teams</label>
                    <div className="border rounded p-3" style={{maxHeight: '200px', overflowY: 'auto'}}>
                      {teams.length > 0 ? (
                        teams.map(team => (
                          <div key={team.id} className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`team-${team.id}`}
                              checked={selectedTeams.includes(team.id)}
                              onChange={() => handleTeamToggle(team.id)}
                            />
                            <label className="form-check-label" htmlFor={`team-${team.id}`}>
                              {team.name}
                            </label>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted mb-0">No teams available</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleClose}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
