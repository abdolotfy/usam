// SignupPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase'; // Import Firebase Auth and Firestore
import './LoginPage.css';

function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      if (!email || !password || !username) {
        alert('Please fill out all fields');
        return;
      }

      // Sign up the user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save additional user information to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        username,
        email,
      });

      alert('Signup successful!');
      navigate('/'); // Redirect to home page or wherever needed
    } catch (error) {
      console.error('Signup failed:', error.message);
      alert('Signup failed: ' + error.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Sign Up</h2>
      <input 
        type="text" 
        placeholder="User Name" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
      />
      <input 
        type="email" 
        placeholder="Email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
}

export default SignupPage;
