import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../api';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      navigate('/tasks');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="page-center">
      <form onSubmit={handleSubmit} className="form-container">
        <h2 className="form-title">Task Manager Login</h2>
        <div className="form-group">
          <label className="form-label">Username</label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} required className="form-input" />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="form-input" />
        </div>
        {error && <div className="form-error">{error}</div>}
        <button type="submit" className="form-button">Login</button>
      </form>
    </div>
  );
}

export default Login; 
