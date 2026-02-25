import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const codespace = process.env.REACT_APP_CODESPACE_NAME;
    const apiUrl = codespace 
      ? `https://${codespace}-8000.app.github.dev/api/leaderboard/`
      : 'http://localhost:8000/api/leaderboard/';
    
    console.log('Leaderboard API endpoint:', apiUrl);

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Leaderboard fetched data:', data);
        // Handle both paginated (.results) and plain array responses
        const leaderboardData = data.results || data;
        setLeaderboard(Array.isArray(leaderboardData) ? leaderboardData : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching leaderboard:', error);
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
          <p className="mt-3">Loading leaderboard...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading Leaderboard</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="page-header text-center">
        <h2>🏆 Leaderboard</h2>
        <p className="mb-0">Top performers and their achievements</p>
      </div>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">Rank</th>
              <th scope="col">User</th>
              <th scope="col">Email</th>
              <th scope="col">Fitness Level</th>
              <th scope="col">Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.length > 0 ? (
              leaderboard.map((entry, index) => (
                <tr key={entry.id || index}>
                  <td>
                    {index < 3 ? (
                      <span className="badge bg-warning text-dark fs-6">{index + 1}</span>
                    ) : (
                      <span className="fs-6 fw-bold">{index + 1}</span>
                    )}
                  </td>
                  <td>
                    <strong>{entry.user?.username || 'Unknown'}</strong>
                  </td>
                  <td>
                    <small className="text-muted">{entry.user?.email || 'N/A'}</small>
                  </td>
                  <td>
                    <span className={`badge ${
                      entry.user?.fitness_level === 'advanced' ? 'bg-danger' :
                      entry.user?.fitness_level === 'intermediate' ? 'bg-warning' :
                      'bg-success'
                    }`}>
                      {entry.user?.fitness_level ? 
                        entry.user.fitness_level.charAt(0).toUpperCase() + entry.user.fitness_level.slice(1) : 
                        'Beginner'}
                    </span>
                  </td>
                  <td>
                    <span className="badge bg-primary fs-6">{entry.score || 0}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted py-4">
                  <i>No leaderboard data found</i>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard;
