import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Users from './components/Users';
import Teams from './components/Teams';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Workouts from './components/Workouts';

function Home() {
  return (
    <div className="container mt-4">
      <div className="jumbotron">
        <h1 className="display-4">Welcome to OctoFit Tracker! 🎯</h1>
        <p className="lead">
          Track your fitness journey, compete with teams, and achieve your goals.
        </p>
        <hr className="my-4" />
        <p>
          Use the navigation menu above to explore users, teams, activities, leaderboard, and workout suggestions.
        </p>
        <div className="row mt-5">
          <div className="col-md-4 mb-3">
            <Link to="/users" className="text-decoration-none">
              <div className="card text-center h-100" style={{cursor: 'pointer', transition: 'all 0.3s ease'}}>
                <div className="card-body">
                  <h2 className="mb-3">👤</h2>
                  <h5 className="card-title">Users</h5>
                  <p className="card-text">View all registered users and profiles</p>
                  <span className="btn btn-primary">View Users</span>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-md-4 mb-3">
            <Link to="/activities" className="text-decoration-none">
              <div className="card text-center h-100" style={{cursor: 'pointer', transition: 'all 0.3s ease'}}>
                <div className="card-body">
                  <h2 className="mb-3">📊</h2>
                  <h5 className="card-title">Activities</h5>
                  <p className="card-text">Log your workouts and monitor progress</p>
                  <span className="btn btn-primary">View Activities</span>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-md-4 mb-3">
            <Link to="/leaderboard" className="text-decoration-none">
              <div className="card text-center h-100" style={{cursor: 'pointer', transition: 'all 0.3s ease'}}>
                <div className="card-body">
                  <h2 className="mb-3">🏆</h2>
                  <h5 className="card-title">Leaderboard</h5>
                  <p className="card-text">Climb the rankings and compete</p>
                  <span className="btn btn-primary">View Leaderboard</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
          <div className="container">
            <Link className="navbar-brand" to="/">
              <img src="/octofitapp-small.png" alt="OctoFit Logo" className="navbar-logo" />
              OctoFit Tracker
            </Link>
            <button 
              className="navbar-toggler" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#navbarNav"
              aria-controls="navbarNav" 
              aria-expanded="false" 
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/">🏠 Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/users">👤 Users</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/teams">👥 Teams</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/activities">📊 Activities</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/leaderboard">🏆 Leaderboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/workouts">💪 Workouts</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
