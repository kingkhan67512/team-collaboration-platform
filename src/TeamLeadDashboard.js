import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { collection, query, where, onSnapshot, updateDoc, doc, getDocs } from 'firebase/firestore'; // Import necessary Firestore functions

const TeamLeadDashboard = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [allUsers, setAllUsers] = useState([]); // Store all users for member assignment
  const userId = auth.currentUser ? auth.currentUser.uid : null;
  const [selectedMembers, setSelectedMembers] = useState({}); // Track selected members for each workspace
  
  useEffect(() => {
    if (!userId) return;
  
    // Log Firestore data fetched for debugging
    const q = query(collection(db, 'workspaces'), where('members', 'array-contains', userId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const workspaceList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      console.log("Fetched workspaces:", workspaceList); // Log workspaces to verify data
      setWorkspaces(workspaceList); // Update state with fetched workspaces
    });
  
    return () => unsubscribe();
  }, [userId]);
  

  useEffect(() => {
    if (!userId) {
      console.log("No userId found! The user might not be logged in.");
      return;
    }
  
    console.log("Logged in userId:", userId); // Log the userId to ensure it's fetched
    const q = query(collection(db, 'workspaces'), where('members', 'array-contains', userId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const workspaceList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Fetched workspaces:", workspaceList); // Log the fetched workspaces
      setWorkspaces(workspaceList);
    });
  
    return () => unsubscribe();
  }, [userId]);
  
  useEffect(() => {
    if (!userId) return;

    // Fetch workspaces assigned to this team lead in real-time
    const q = query(collection(db, 'workspaces'), where('members', 'array-contains', userId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const workspaceList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWorkspaces(workspaceList);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [userId]);

  // Fetch all users to assign members
  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAllUsers(usersList);
    };
    fetchUsers();
  }, []);

  // Handle status change for the workspace
  const handleStatusChange = async (workspaceId, newStatus) => {
    const workspaceDocRef = doc(db, 'workspaces', workspaceId);

    try {
      await updateDoc(workspaceDocRef, { status: newStatus });
      alert('Status updated successfully!');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  // Handle assigning members to the workspace
  const handleMemberAssign = async (workspaceId, members) => {
    const workspaceDocRef = doc(db, 'workspaces', workspaceId);

    try {
      await updateDoc(workspaceDocRef, { members });
      alert('Members assigned successfully!');
    } catch (error) {
      console.error('Error assigning members:', error);
      alert('Failed to assign members. Please try again.');
    }
  };

  // Handle member selection for a workspace
  const handleMemberSelection = (workspaceId, memberId) => {
    setSelectedMembers((prev) => ({
      ...prev,
      [workspaceId]: prev[workspaceId]
        ? [...prev[workspaceId], memberId]
        : [memberId],
    }));
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Team Lead Dashboard</h1>
      <h2 className="mt-4">Manage Workspaces</h2>

      <ul className="list-group">
        {workspaces.map(workspace => (
          <li key={workspace.id} className="list-group-item">
            <h5>{workspace.name}</h5>
            <p>Status: {workspace.status}</p>

            {/* Dropdown to change workspace status */}
            <select
              className="form-select mb-3"
              value={workspace.status}
              onChange={(e) => handleStatusChange(workspace.id, e.target.value)}
            >
              <option value="Active">Active</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            {/* Members Assignment */}
            <h6>Assign Members:</h6>
            <div className="mb-3">
              {allUsers.map(user => (
                <div key={user.id} className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`member-${workspace.id}-${user.id}`}
                    onChange={() => handleMemberSelection(workspace.id, user.id)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`member-${workspace.id}-${user.id}`}
                  >
                    {user.name || user.email} {/* Display user name or email */}
                  </label>
                </div>
              ))}
            </div>

            <button
              className="btn btn-primary"
              onClick={() => handleMemberAssign(workspace.id, selectedMembers[workspace.id] || [])}
            >
              Assign Members
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamLeadDashboard;
