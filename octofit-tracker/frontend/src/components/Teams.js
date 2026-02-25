import React, { useState, useEffect } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const codespace = process.env.REACT_APP_CODESPACE_NAME;
    const apiUrl = codespace 
      ? `https://${codespace}-8000.app.github.dev/api/teams/`
      : 'http://localhost:8000/api/teams/';
    
    console.log('Teams API endpoint:', apiUrl);

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Teams fetched data:', data);
        // Handle both paginated (.results) and plain array responses
        const teamsData = data.results || data;
        setTeams(Array.isArray(teamsData) ? teamsData : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching teams:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading teams...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading Teams</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="page-header text-center">
        <h2>👥 Teams</h2>
        <p className="mb-0">Join a team and compete together</p>
      </div>
      <div className="row">
        {teams.length > 0 ? (
          teams.map(team => (
            <div key={team.id} className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{team.name}</h5>
                  <div className="mt-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="text-muted">👤 Members:</span>
                      <span className="badge bg-primary rounded-pill">{team.members?.length || 0}</span>
                    </div>
                    {team.members && team.members.length > 0 && (
                      <div className="mb-3">
                        <small className="text-muted d-block mb-2">Team Members:</small>
                        <div className="d-flex flex-wrap gap-1">
                          {team.members.map(member => (
                            <span key={member.id} className="badge bg-secondary">
                              {member.username}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <button className="btn btn-outline-primary mt-auto w-100">View Team Details</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="alert alert-info text-center" role="alert">
              <i>No teams found. Create a team to get started!</i>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Teams;
