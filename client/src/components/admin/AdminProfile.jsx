import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Avatar,
  Alert,
  CircularProgress,
  Divider,
  Paper,
  Chip,
} from '@mui/material';
import { adminAPI } from '../../services/api';

const AdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      // For admin, we'll use the admin API
      const response = await adminAPI.getProfile();
      const userData = response.data;
      setProfile(userData);
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
      });
    } catch (err) {
      setError('Failed to load profile');
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Name and email are required');
      return;
    }

    try {
      const response = await adminAPI.updateProfile(formData);
      setProfile(response.data.user);
      setEditing(false);
      setSuccess('Profile updated successfully!');
      setError('');
      
      // Update localStorage with new user data
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...currentUser, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update profile');
      console.error('Error updating profile:', err);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profile?.name || '',
      email: profile?.email || '',
    });
    setEditing(false);
    setError('');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Administrator Profile
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'error.main',
                  fontSize: '3rem',
                }}
              >
                {profile?.name?.charAt(0)?.toUpperCase() || 'A'}
              </Avatar>
              <Typography variant="h6" gutterBottom>
                {profile?.name || 'Administrator'}
              </Typography>
              <Chip 
                label="Administrator" 
                color="error" 
                size="small" 
                sx={{ mb: 1 }}
              />
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                System Administrator
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Administrative Information
                </Typography>
                {!editing && (
                  <Button
                    variant="outlined"
                    onClick={() => setEditing(true)}
                  >
                    Edit Profile
                  </Button>
                )}
              </Box>

              {editing ? (
                <Box>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                  />
                  <Box display="flex" gap={2}>
                    <Button
                      variant="contained"
                      onClick={handleSave}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box>
                  <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Name
                    </Typography>
                    <Typography variant="body1">
                      {profile?.name || 'Not set'}
                    </Typography>
                  </Paper>
                  
                  <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Email
                    </Typography>
                    <Typography variant="body1">
                      {profile?.email || 'Not set'}
                    </Typography>
                  </Paper>
                  
                  <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Role
                    </Typography>
                    <Typography variant="body1">
                      System Administrator
                    </Typography>
                  </Paper>
                  
                  <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Permissions
                    </Typography>
                    <Typography variant="body1">
                      Full system access - User management, Therapist management, Analytics, Settings
                    </Typography>
                  </Paper>
                  
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      User ID
                    </Typography>
                    <Typography variant="body1">
                      {profile?.id || 'N/A'}
                    </Typography>
                  </Paper>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminProfile; 