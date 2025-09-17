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
import { therapistAPI } from '../../services/api';

const TherapistProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specialization: '',
    bio: '',
    experience: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await therapistAPI.getProfile();
      const userData = response.data.therapist;
      setProfile(userData);
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        specialization: userData.specialization || '',
        bio: userData.bio || '',
        experience: userData.experience || '',
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
      const response = await therapistAPI.updateProfile(formData);
      setProfile(response.data.therapist);
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
      specialization: profile?.specialization || '',
      bio: profile?.bio || '',
      experience: profile?.experience || '',
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
        My Profile
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
                  bgcolor: 'warning.main',
                  fontSize: '3rem',
                }}
              >
                {profile?.name?.charAt(0)?.toUpperCase() || 'T'}
              </Avatar>
              <Typography variant="h6" gutterBottom>
                {profile?.name || 'Therapist'}
              </Typography>
              <Chip 
                label="Therapist" 
                color="warning" 
                size="small" 
                sx={{ mb: 1 }}
              />
              {profile?.rating && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" color="textSecondary">
                    Rating: ⭐ {profile.rating}/5
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Professional Information
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
                  <TextField
                    fullWidth
                    label="Specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                    placeholder="e.g., Anxiety & Depression, Trauma Therapy"
                  />
                  <TextField
                    fullWidth
                    label="Experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                    placeholder="e.g., 8 years"
                  />
                  <TextField
                    fullWidth
                    label="Bio"
                    name="bio"
                    multiline
                    rows={4}
                    value={formData.bio}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                    placeholder="Tell patients about your background and approach..."
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
                      Specialization
                    </Typography>
                    <Typography variant="body1">
                      {profile?.specialization || 'Not specified'}
                    </Typography>
                  </Paper>
                  
                  <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Experience
                    </Typography>
                    <Typography variant="body1">
                      {profile?.experience || 'Not specified'}
                    </Typography>
                  </Paper>
                  
                  <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Bio
                    </Typography>
                    <Typography variant="body1">
                      {profile?.bio || 'No bio available'}
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

export default TherapistProfile; 