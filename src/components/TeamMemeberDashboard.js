// src/TeamMemberDashboard.js
import React from 'react';
import TaskTimer from './components/TaskTimer'; // Import the TaskTimer component

const TeamMemberDashboard = () => {
  return (
    <div className="container mt-5">
      <h1 className="text-center">Team Member Dashboard</h1>
      <h2 className="mt-4">Track Time on Tasks</h2>
      <TaskTimer /> {/* Add time tracking functionality */}
    </div>
  );
};

export default TeamMemberDashboard;
