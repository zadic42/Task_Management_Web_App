import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../api';

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

function TaskForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('pending');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!title || !dueDate) {
      setError('Title and Due Date are required');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/tasks', {
        title,
        description,
        due_date: dueDate,
        status,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setMessage('Task added!');
      setTimeout(() => navigate('/tasks'), 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add task');
    }
  };

  return (
    <div className="page-center">
      <form onSubmit={handleSubmit} className="form-container">
        <h2 className="form-title">Add Task</h2>
        <div className="form-group">
          <label className="form-label">Title</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="form-input" />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="form-input" />
        </div>
        <div className="form-group">
          <label className="form-label">Due Date</label>
          <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required className="form-input" />
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)} className="form-select">
            {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        {error && <div className="form-error">{error}</div>}
        {message && <div className="form-success">{message}</div>}
        <button type="button" className="form-button" style={{background:'#e0e0e0',color:'#222',marginBottom:'0.5rem'}} onClick={() => navigate('/tasks')}>Back</button>
        <button type="submit" className="form-button">Add Task</button>
      </form>
    </div>
  );
}

export default TaskForm; 
