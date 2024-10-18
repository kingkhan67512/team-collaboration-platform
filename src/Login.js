// src/Login.js
import React, { useState } from 'react';
import { auth } from './firebase'; // Firebase Auth instance
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { db } from './firebase'; // Firebase Firestore instance
import { doc, getDoc } from 'firebase/firestore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // React Router's navigation hook

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Sign in with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch the user role from Firestore
      const docRef = doc(db, 'users', user.uid); // Assuming the user role is stored in 'users' collection
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        const userRole = userData.role; // Assuming role is stored in Firestore under 'role' field

        // Redirect based on user role
        if (userRole === 'admin') {
          navigate('/admin-dashboard');
        } else if (userRole === 'teamLead') {
          navigate('/teamlead-dashboard');
        } else if (userRole === 'teamMember') {
          navigate('/team-member-dashboard');
        } else {
          console.error('Unknown user role:', userRole);
          alert('Error: Unknown role');
        }
      } else {
        console.error('No such user in Firestore!');
        alert('No user data found');
      }
    } catch (error) {
      setError(error.message);
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h1 className="text-center mb-4">Login</h1>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleLogin}>
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

            <button type="submit" className="btn btn-primary w-100">Login</button>
          </form>

          <div className="mt-3 text-center">
            <p>Don't have an account? <button className="btn btn-link" onClick={() => navigate('/signup')}>Sign Up</button></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
