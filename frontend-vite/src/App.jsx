import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import TaskList from './pages/TaskList';
import TaskForm from './pages/TaskForm';
import TaskEdit from './pages/TaskEdit';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/tasks" element={isAuthenticated ? <TaskList /> : <Navigate to="/login" />} />
        <Route path="/tasks/new" element={isAuthenticated ? <TaskForm /> : <Navigate to="/login" />} />
        <Route path="/tasks/:id/edit" element={isAuthenticated ? <TaskEdit /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/tasks" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
