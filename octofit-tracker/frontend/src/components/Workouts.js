import React, { useState, useEffect } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const codespace = process.env.REACT_APP_CODESPACE_NAME;
    const apiUrl = codespace 
      ? `https://${codespace}-8000.app.github.dev/api/workouts/`
      : 'http://localhost:8000/api/workouts/';
    
    console.log('Workouts API endpoint:', apiUrl);

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Workouts fetched data:', data);
        // Handle both paginated (.results) and plain array responses
        const workoutsData = data.results || data;
        setWorkouts(Array.isArray(workoutsData) ? workoutsData : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching workouts:', error);
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
          <p className="mt-3">Loading workouts...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading Workouts</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="page-header text-center">
        <h2>💪 Workout Suggestions</h2>
        <p className="mb-0">Personalized exercises to reach your goals</p>
      </div>
      <div className="row">
        {workouts.length > 0 ? (
          workouts.map(workout => {
            const exerciseCount = Array.isArray(workout.exercises) ? workout.exercises.length : 0;
            
            return (
              <div key={workout.id} className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100">
                  <div className="card-body d-flex flex-column">
                    <div className="mb-3">
                      <h5 className="card-title text-primary">{workout.name}</h5>
                      <span className="badge bg-secondary">
                        {exerciseCount} {exerciseCount === 1 ? 'Exercise' : 'Exercises'}
                      </span>
                    </div>
                    <p className="card-text flex-grow-1">{workout.description || 'No description available'}</p>
                    
                    {exerciseCount > 0 && (
                      <div className="mt-3 mb-3">
                        <h6 className="text-muted small mb-2">Exercises:</h6>
                        <div className="d-flex flex-wrap gap-1">
                          {workout.exercises.slice(0, 5).map((exercise, idx) => (
                            <span key={idx} className="badge bg-info text-dark">
                              {typeof exercise === 'string' ? exercise : exercise.name || `Exercise ${idx + 1}`}
                            </span>
                          ))}
                          {exerciseCount > 5 && (
                            <span className="badge bg-secondary">+{exerciseCount - 5} more</span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <button className="btn btn-primary mt-auto w-100">View Workout Details</button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-12">
            <div className="alert alert-info text-center" role="alert">
              <i>No workouts found. Check back later for personalized suggestions!</i>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Workouts;
