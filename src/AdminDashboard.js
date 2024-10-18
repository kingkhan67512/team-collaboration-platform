import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase'; // Import Firestore and Auth
import { collection, addDoc, onSnapshot, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore'; // Import necessary Firestore functions
import moment from 'moment'; // For date formatting

const AdminDashboard = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceDescription, setWorkspaceDescription] = useState('');
  const [teamLeads, setTeamLeads] = useState([]); // Store available team leads
  const [selectedTeamLead, setSelectedTeamLead] = useState(''); // Track selected team lead

  // Fetch available team leads when the component mounts
  useEffect(() => {
    const fetchTeamLeads = async () => {
      const q = query(collection(db, 'users'), where('role', '==', 'teamLead')); // Fetch users with role 'teamLead'
      const querySnapshot = await getDocs(q);
      const leads = querySnapshot.docs.map(doc => ({
        id: doc.id, // The UID of the team lead
        ...doc.data(),
      }));
      setTeamLeads(leads); // Set the list of team leads
    };

    fetchTeamLeads();
  }, []);

  // Fetch existing workspaces in real-time
  useEffect(() => {
    const workspacesCollection = collection(db, 'workspaces');
    const unsubscribe = onSnapshot(workspacesCollection, (snapshot) => {
      const workspaceList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWorkspaces(workspaceList);
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, []);

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();

    if (workspaceName.trim() === '') {
      alert('Workspace name cannot be empty!');
      return;
    }

    if (!selectedTeamLead) {
      alert('Please select a team lead.');
      return;
    }

    try {
      // Create a new workspace with the selected team lead's UID in the members array
      await addDoc(collection(db, 'workspaces'), {
        name: workspaceName,
        createdAt: new Date(), // Current timestamp
        adminId: auth.currentUser.uid, // Admin UID
        members: [selectedTeamLead], // Add the team lead UID to the members array
        status: 'Pending', // Set initial status to Pending
        description: workspaceDescription || '',
      });
      setWorkspaceName(''); // Reset form fields
      setWorkspaceDescription('');
      setSelectedTeamLead('');
      alert('Workspace created successfully!');
    } catch (error) {
      console.error('Error creating workspace:', error);
      alert('Failed to create workspace. Please try again.');
    }
  };

  // Handle removing a workspace
  const handleRemoveWorkspace = async (workspaceId) => {
    const workspaceDocRef = doc(db, 'workspaces', workspaceId);
    
    try {
      await deleteDoc(workspaceDocRef); // Delete the workspace document
      alert('Workspace removed successfully!');
    } catch (error) {
      console.error('Error removing workspace:', error);
      alert('Failed to remove workspace. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Admin Dashboard</h1>
      
      <form onSubmit={handleCreateWorkspace} className="mb-4">
        <div className="mb-3">
          <input 
            type="text" 
            className="form-control" 
            value={workspaceName} 
            onChange={(e) => setWorkspaceName(e.target.value)} 
            placeholder="Workspace Name" 
            required 
          />
        </div>
        <div className="mb-3">
          <textarea 
            className="form-control" 
            value={workspaceDescription} 
            onChange={(e) => setWorkspaceDescription(e.target.value)} 
            placeholder="Workspace Description" 
          />
        </div>

        {/* Dropdown to select a team lead */}
        <div className="mb-3">
          <label htmlFor="teamLeadSelect">Assign Team Lead:</label>
          <select
            id="teamLeadSelect"
            className="form-select"
            value={selectedTeamLead}
            onChange={(e) => setSelectedTeamLead(e.target.value)} // Set the selected team lead's UID
            required
          >
            <option value="">Select a team lead</option>
            {teamLeads.map(lead => (
              <option key={lead.id} value={lead.id}>
                {lead.name || lead.email} {/* Display team lead name or email */}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary">Create Workspace</button>
      </form>

      <h2 className="mt-4">Existing Workspaces</h2>
      <ul className="list-group">
        {workspaces.map(workspace => (
          <li key={workspace.id} className="list-group-item">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{workspace.name}</strong> - {moment(workspace.createdAt.toDate()).format('MMMM Do YYYY, h:mm:ss a')}
                <p>Status: {workspace.status}</p> {/* Show workspace status */}
              </div>
              <button 
                className="btn btn-danger btn-sm" 
                onClick={() => handleRemoveWorkspace(workspace.id)}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
