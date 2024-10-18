// src/components/AssignTask.js
import React, { useState } from 'react';
import { db } from '../firebase'; // Adjust the import path based on your structure
import { doc, setDoc, collection } from 'firebase/firestore';

const AssignTask = ({ selectedMemberId, workspaceId }) => {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const createTask = async (e) => {
    e.preventDefault();

    const taskDocRef = doc(collection(db, 'tasks')); // Create a reference for the new task

    try {
      await setDoc(taskDocRef, {
        name: taskName,
        description: taskDescription,
        dueDate: new Date(dueDate), // Store the due date as a Firestore Timestamp
        assignedTo: selectedMemberId, // Automatically assign to the selected member
        status: 'Pending',
        workspaceId: workspaceId, // Store the associated workspace ID
        createdAt: new Date(),
      });
      alert('Task created and assigned successfully!');

      // Optionally reset the form fields
      setTaskName('');
      setTaskDescription('');
      setDueDate('');
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task. Please try again.');
    }
  };

  return (
    <form onSubmit={createTask}>
      <div className="mb-3">
        <label className="form-label">Task Name</label>
        <input
          type="text"
          className="form-control"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Task Description</label>
        <textarea
          className="form-control"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Due Date</label>
        <input
          type="datetime-local"
          className="form-control"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary">Create Task</button>
    </form>
  );
};

export default AssignTask;
