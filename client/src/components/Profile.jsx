import React, { useState, useEffect } from 'react';
import UserProfile from './user/Profile';
import TherapistProfile from './therapist/TherapistProfile';
import AdminProfile from './admin/AdminProfile';
import { Box, CircularProgress } from '@mui/material';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  // Render the appropriate profile component based on user role
  switch (user?.role) {
    case 'therapist':
      return <TherapistProfile />;
    case 'admin':
      return <AdminProfile />;
    case 'user':
    default:
      return <UserProfile />;
  }
};

export default Profile; 