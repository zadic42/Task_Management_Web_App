import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

function TaskEdit() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('pending');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axios.get(`https://task-management-web-app-backend-1ddz.onrender.com/api/tasks`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const task = res.data.find(t => t._id === id);
        if (!task) return setError('Task not found');
        setTitle(task.title);
        setDescription(task.description);
        setDueDate(task.due_date ? task.due_date.substring(0, 10) : '');
        setStatus(task.status);
      } catch (err) {
        setError('Failed to fetch task');
      }
    };
    fetchTask();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!title || !dueDate) {
      setError('Title and Due Date are required');
      return;
    }
    try {
      await axios.put(`https://task-management-web-app-backend-1ddz.onrender.com/api/tasks/${id}`, {
        title,
        description,
        due_date: dueDate,
        status,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setMessage('Task updated!');
      setTimeout(() => navigate('/tasks'), 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
    }
  };

  return (
    <div className="page-center">
      <form onSubmit={handleSubmit} className="form-container">
        <h2 className="form-title">Edit Task</h2>
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
        <button type="submit" className="form-button">Update Task</button>
      </form>
    </div>
  );
}

export default TaskEdit; 
