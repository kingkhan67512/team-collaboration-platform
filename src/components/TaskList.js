// src/components/TaskList.js
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';  // Adjust import based on your structure
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { format } from 'date-fns'; // Import date-fns for formatting

const TaskList = ({ userId }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const q = query(collection(db, 'tasks'), where('assignedTo', '==', userId));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const taskList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(taskList);
      });

      return () => unsubscribe(); // Cleanup listener on unmount
    };

    fetchTasks();
  }, [userId]);

  return (
    <div>
      <h2>Your Assigned Tasks</h2>
      <ul className="list-group">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <li key={task.id} className="list-group-item">
              <h5>{task.title}</h5>
              <p>{task.description}</p>
              <p>Status: {task.status}</p>
              {/* Check if dueDate exists before calling toDate */}
              <p>Due Date: {task.dueDate ? format(task.dueDate.toDate(), 'MMM dd, yyyy hh:mm a') : 'Not Set'}</p>
            </li>
          ))
        ) : (
          <p>No tasks assigned yet.</p>
        )}
      </ul>
    </div>
  );
};

export default TaskList;
