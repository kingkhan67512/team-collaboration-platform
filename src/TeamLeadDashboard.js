import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { collection, query, where, onSnapshot, updateDoc, doc, getDocs, arrayUnion, arrayRemove } from 'firebase/firestore';
import AssignTask from './components/AssignTask'; // Import the AssignTask component

const TeamLeadDashboard = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [allMembers, setAllMembers] = useState([]); // Store only team members for assignment
  const userId = auth.currentUser ? auth.currentUser.uid : null;
  const [selectedMembers, setSelectedMembers] = useState({}); // Track selected members for each workspace
  const [selectedMemberId, setSelectedMemberId] = useState(null); // Store the selected member's ID

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

      // Fetch selected members for each workspace
      const newSelectedMembers = {};
      workspaceList.forEach(workspace => {
        newSelectedMembers[workspace.id] = workspace.members.filter(member => member !== userId);
      });
      setSelectedMembers(newSelectedMembers); // Store assigned members for checkboxes
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [userId]);

  // Fetch all users and filter to include only team members
  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Filter to include only team members
      const teamMembers = usersList.filter(user => user.role === 'teamMember');
      setAllMembers(teamMembers); // Store only team members
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
  const handleMemberAssign = async (workspaceId) => {
    const workspaceDocRef = doc(db, 'workspaces', workspaceId);

    try {
      // Add the selected members to the existing 'members' array using arrayUnion
      await updateDoc(workspaceDocRef, {
        members: arrayUnion(...selectedMembers[workspaceId], userId) // Ensure the team lead's UID stays in the members array
      });

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
        ? prev[workspaceId].includes(memberId)
          ? prev[workspaceId].filter(id => id !== memberId) // Uncheck if already selected
          : [...prev[workspaceId], memberId] // Check if not selected
        : [memberId],
    }));
    setSelectedMemberId(memberId); // Update selected member ID
  };

  // Handle removing members from the workspace
  const handleMemberRemove = async (workspaceId) => {
    const workspaceDocRef = doc(db, 'workspaces', workspaceId);

    try {
      await updateDoc(workspaceDocRef, {
        members: arrayRemove(...selectedMembers[workspaceId]) // Remove selected members
      });
      setSelectedMembers((prev) => ({
        ...prev,
        [workspaceId]: [], // Reset selected members
      }));

      alert('Members removed successfully!');
    } catch (error) {
      console.error('Error removing members:', error);
      alert('Failed to remove members. Please try again.');
    }
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
              <option value="Pending">Pending</option>
              <option value="Active">Active</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            {/* Members Assignment */}
            <h6>Assign Members:</h6>
            <div className="mb-3">
              {allMembers.map(user => (
                <div key={user.id} className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`member-${workspace.id}-${user.id}`}
                    checked={selectedMembers[workspace.id]?.includes(user.id) || false} // Keep checkbox checked based on selection
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
              className="btn btn-primary mb-2"
              onClick={() => handleMemberAssign(workspace.id)}
            >
              Assign Members
            </button>
            {/* Button to Remove Selected Members */}
            <button
              className="btn btn-danger"
              onClick={() => handleMemberRemove(workspace.id)}
            >
              Remove Selected Members
            </button>

            {/* Assign Task to Selected Member */}
            {selectedMemberId && (
              <AssignTask selectedMemberId={selectedMemberId} workspaceId={workspace.id} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamLeadDashboard;
