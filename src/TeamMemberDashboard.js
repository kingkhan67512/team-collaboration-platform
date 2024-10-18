// src/TeamMemberDashboard.js
import React from 'react';
import TaskList from './components/TaskList';
import { auth } from './firebase';  // Firebase auth to get logged-in user's ID

const TeamMemberDashboard = () => {
  const userId = auth.currentUser.uid;  // Get the logged-in user's ID

  return (
    <div className="container mt-5">
      <h1 className="text-center">Team Member Dashboard</h1>
      <h2 className="mt-4">Your Assigned Tasks</h2>
      <TaskList userId={userId} />  {/* Pass the userId (UID) to TaskList */}
    </div>
  );
};

export default TeamMemberDashboard;
