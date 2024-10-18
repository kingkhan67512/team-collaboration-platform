import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Firestore instance

const TaskAssignmentForm = () => {
  const [taskTitle, setTaskTitle] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    // Fetch team members from Firestore
    const fetchTeamMembers = async () => {
      const teamMembersCollection = collection(db, 'teamMembers');
      const memberSnapshot = await getDocs(teamMembersCollection);
      const members = memberSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTeamMembers(members);
    };

    fetchTeamMembers();
  }, []);

  const handleAssignTask = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'tasks'), {
        title: taskTitle,
        assignedTo: assignedTo, // Assign to selected team member
        status: 'Pending', // Default task status
        createdAt: new Date(),
      });

      setTaskTitle('');
      setAssignedTo('');
      alert('Task assigned successfully!');
    } catch (error) {
      console.error('Error assigning task:', error);
      alert('Failed to assign task.');
    }
  };

  return (
    <div className="mt-4">
      <h3>Assign New Task</h3>
      <form onSubmit={handleAssignTask}>
        <div className="mb-3">
          <label htmlFor="taskTitle" className="form-label">Task Title</label>
          <input 
            type="text" 
            className="form-control" 
            id="taskTitle" 
            value={taskTitle} 
            onChange={(e) => setTaskTitle(e.target.value)} 
            placeholder="Enter task title" 
            required 
          />
        </div>

        <div className="mb-3">
          <label htmlFor="assignedTo" className="form-label">Assign to Team Member</label>
          <select 
            className="form-select" 
            id="assignedTo" 
            value={assignedTo} 
            onChange={(e) => setAssignedTo(e.target.value)} 
            required
          >
            <option value="">Select team member</option>
            {teamMembers.map(member => (
              <option key={member.id} value={member.id}>{member.name}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary">Assign Task</button>
      </form>
    </div>
  );
};

export default TaskAssignmentForm;
