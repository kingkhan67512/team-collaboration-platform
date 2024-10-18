// src/components/TaskStatus.js
import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Firestore instance

const TaskStatus = ({ taskId, currentStatus }) => {
  const [status, setStatus] = useState(currentStatus);

  const updateStatus = async (newStatus) => {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, {
      status: newStatus,
    });
    setStatus(newStatus);
  };

  return (
    <div>
      <select
        className="form-select"
        value={status}
        onChange={(e) => updateStatus(e.target.value)}
      >
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>
    </div>
  );
};

export default TaskStatus;
