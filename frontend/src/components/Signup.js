import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Auth.css';

const Signup = ({ onSignup }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Clear all old session data when component mounts
  useEffect(() => {
    // Clear localStorage completely on signup page
    localStorage.clear();
    // Also clear sessionStorage
    sessionStorage.clear();
    // Dispatch event to clear user context
    window.dispatchEvent(new CustomEvent('userLoggedOut'));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Clear localStorage before signup to ensure clean state
    localStorage.clear();
    sessionStorage.clear();

    try {
      const { data } = await axios.post('/api/users', { name, email, password });
      
      // Store only the new user data (no merging with old data)
      const newUserData = {
        _id: data._id,
        name: data.name,
        email: data.email,
        isAdmin: data.isAdmin || false,
        token: data.token,
        // Ensure fresh user has no old data
        profilePicture: '',
        username: '',
        phone: '',
        address: '',
      };
      
      // Store fresh user data
      localStorage.setItem('userInfo', JSON.stringify(newUserData));
      
      setSuccess(true);
      
      // Notify context to update
      window.dispatchEvent(new CustomEvent('userUpdated', { detail: newUserData }));
      
      // Call onSignup with fresh data
      if (onSignup) {
        onSignup(newUserData);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
      // Clear localStorage on error too
      localStorage.clear();
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">Signup successful! Redirecting to dashboard...</div>}
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
