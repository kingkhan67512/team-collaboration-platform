// src/components/TaskList.js
import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';  // Firebase Firestore

const TaskList = ({ userId }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (!userId) return;

    // Query tasks where 'assignedTo' is the logged-in team member's UID
    const q = query(collection(db, 'tasks'), where('assignedTo', '==', userId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(taskList);
    });

    return () => unsubscribe();  // Cleanup listener on unmount
  }, [userId]);

  return (
    <div className="list-group">
      {tasks.length > 0 ? (
        tasks.map(task => (
          <div key={task.id} className="list-group-item">
            <h5>{task.name}</h5>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
          </div>
        ))
      ) : (
        <p>No tasks assigned yet.</p>
      )}
    </div>
  );
};

export default TaskList;
