import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    try {
      const { data } = await axios.post('/api/users/login', { email, password });
      
      // Clear old localStorage data before storing new login data
      localStorage.clear();
      sessionStorage.clear();
      
      // Store only the login response data (fresh data from backend)
      const loginUserData = {
        _id: data._id,
        name: data.name,
        email: data.email,
        isAdmin: data.isAdmin || false,
        token: data.token,
      };
      
      localStorage.setItem('userInfo', JSON.stringify(loginUserData));
      
      setSuccess(true);
      
      // Notify context
      window.dispatchEvent(new CustomEvent('userUpdated', { detail: loginUserData }));
      
      onLogin && onLogin(loginUserData);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      // Clear on error too
      localStorage.clear();
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">Login Successful!</div>}
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
};

export default Login;
