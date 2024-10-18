// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './SignUp';
import Login from './Login';
import AdminDashboard from './AdminDashboard';
import TeamLeadDashboard from './TeamLeadDashboard';
import TeamMemberDashboard from './TeamMemberDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/teamlead-dashboard" element={<TeamLeadDashboard />} />
        <Route path="/team-member-dashboard" element={<TeamMemberDashboard />} />
        <Route path="/" element={<SignUp />} /> {/* Default route */}
      </Routes>
    </Router>
  );
}

export default App;
