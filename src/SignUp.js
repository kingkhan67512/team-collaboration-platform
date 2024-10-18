// src/SignUp.js
import React, { useState } from 'react';
import { auth, db } from './firebase'; // Firebase Auth and Firestore
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // For navigation after sign-up

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('teamMember'); // Default role
  const [error, setError] = useState('');
  const navigate = useNavigate(); // React Router's navigation hook

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      // Create the user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store the user role in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: email,
        role: role, // Store the selected role (admin, teamLead, or teamMember)
      });

      // Navigate to login page after successful signup
      alert('User signed up successfully with role: ' + role);
      navigate('/login'); // Redirect to the login page after signup success
    } catch (error) {
      setError(error.message);
      console.error('Error signing up:', error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h1 className="text-center mb-4">Sign Up</h1>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSignUp}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input 
                type="email" 
                className="form-control" 
                id="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Enter your email" 
                required 
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input 
                type="password" 
                className="form-control" 
                id="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Enter your password" 
                required 
              />
            </div>

            {/* Role selection */}
            <div className="mb-3">
              <label htmlFor="role" className="form-label">Select Role</label>
              <select 
                className="form-select" 
                id="role" 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="admin">Admin</option>
                <option value="teamLead">Team Lead</option>
                <option value="teamMember">Team Member</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary w-100">Sign Up</button>
          </form>

          <div className="mt-3 text-center">
            <p>Already have an account? <button className="btn btn-link" onClick={() => navigate('/login')}>Login</button></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
