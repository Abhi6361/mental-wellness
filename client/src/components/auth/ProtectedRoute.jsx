import React from 'react';
import { Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If no user data, redirect to login
  if (!user || !user.role) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute; 