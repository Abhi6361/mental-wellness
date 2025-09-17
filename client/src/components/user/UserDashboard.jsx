import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
  }, []);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.name || 'User'}!
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{ mb: 2 }}
                onClick={() => navigate('/user/appointments')}
              >
                Book Therapy Session
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/chat')}
              >
                Chat with AI Assistant
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <Typography variant="body2" color="textSecondary">
                No recent appointments
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserDashboard; 