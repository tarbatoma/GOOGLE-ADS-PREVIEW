// src/Login.js
import React, { useState, useEffect } from 'react';
import './styles/Login.css';
import logo from './assets/noblehouselogologin.jpg';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase'; 

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful:', userCredential.user);

      // Notificăm Root (index.js) că loginul a reușit
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (error) {
      console.error('Error during login:', error.message);
      alert('Login failed. Check your credentials.');
    }
  };

  return (
    <div className={`login-container ${animationComplete ? 'show-content' : ''}`}>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-logo">
          <img src={logo} alt="Company Logo" />
        </div>
        <h2 className="login-title">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
