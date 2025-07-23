import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../api';

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTasks(res.data);
    } catch (err) {
      setMessage({ text: 'Failed to fetch tasks', type: 'error' });
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${deleteId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTasks(tasks.filter(t => t._id !== deleteId));
      setMessage({ text: 'Task deleted', type: 'success' });
    } catch (err) {
      setMessage({ text: 'Failed to delete task', type: 'error' });
    }
    setDeleteId(null);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTasks(tasks.map(t => t._id === id ? { ...t, status: newStatus } : t));
      setMessage({ text: 'Status updated', type: 'success' });
    } catch (err) {
      setMessage({ text: 'Failed to update status', type: 'error' });
    }
  };

  const filteredTasks = tasks.filter(task =>
    (!statusFilter || task.status === statusFilter) &&
    (!search || task.title.toLowerCase().includes(search.toLowerCase()))
  );

  const isOverdue = (task) => {
    if (task.status === 'completed') return false;
    const due = new Date(task.due_date);
    const today = new Date();
    today.setHours(0,0,0,0);
    return due < today;
  };

  return (
    <div className="task-list-container">
      <h2 className="task-list-title">Tasks</h2>
      <div className="task-list-controls">
        <button onClick={() => navigate('/tasks/new')} className="form-button" style={{width:'auto',padding:'0.5rem 1.5rem'}}>Add Task</button>
        <input
          type="text"
          placeholder="Search by Title"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="form-input"
          style={{width:'200px'}}
        />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="form-select" style={{width:'160px'}}>
          <option value="">All Statuses</option>
          {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>
      {message.text && (
        <div className={message.type === 'error' ? 'form-error' : 'form-success'}>{message.text}</div>
      )}
      <div style={{overflowX:'auto'}}>
        <table className="task-list-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map(task => (
              <tr key={task._id}>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td className={isOverdue(task) ? 'overdue' : ''}>{new Date(task.due_date).toLocaleDateString()}</td>
                <td>
                  <select
                    value={task.status}
                    onChange={e => handleStatusChange(task._id, e.target.value)}
                    className="form-select"
                    style={{width:'120px'}}
                  >
                    {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </td>
                <td className="task-list-actions">
                  <button onClick={() => navigate(`/tasks/${task._id}/edit`)} className="edit-btn">Edit</button>
                  <button onClick={() => setDeleteId(task._id)} className="delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {deleteId && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{fontWeight:'bold',marginBottom:'1rem'}}>Delete Task</h3>
            <p style={{marginBottom:'1.5rem'}}>Are you sure you want to delete this task?</p>
            <div className="modal-actions">
              <button onClick={() => setDeleteId(null)} className="cancel-btn">Cancel</button>
              <button onClick={handleDelete} className="delete-btn">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskList; 
