// src/TeamMemberDashboard.js
import React from 'react';
import TaskList from './components/TaskList';
import TimeTracker from './components/TimeTracker';
import Chat from './components/Chat';
import { auth } from './firebase';  // Firebase auth to get logged-in user's ID

const TeamMemberDashboard = () => {
  const userId = auth.currentUser.uid;  // Get the logged-in user's ID

  return (
    <div className="container mt-5">
      <h1 className="text-center">Team Member Dashboard</h1>
      
      <TaskList userId={userId} />  {/* Pass the userId to TaskList */}
      
      {/* Assuming you have a way to get the task ID dynamically */}
      <TimeTracker taskId="task_id_here" />  {/* Replace with actual task ID */}
      
      {/* Replace with actual workspace ID */}
      <Chat workspaceId="workspace_id_here" />  {/* Replace with actual workspace ID */}
    </div>
  );
};

export default TeamMemberDashboard;
