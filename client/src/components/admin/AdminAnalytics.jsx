import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authAPI, adminAPI } from '../../services/api';

const AdminAnalytics = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await adminAPI.getAnalytics();
      console.log('Analytics response:', response.data);
      setAnalytics(response.data.analytics || {});
    } catch (error) {
      console.error('Error loading analytics:', error);
      setError('Failed to load analytics. Please try again later.');
      setAnalytics({});
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: '📊', path: '/dashboard' },
    { text: 'Users', icon: '👥', path: '/users' },
    { text: 'Therapists', icon: '👨‍⚕️', path: '/therapists' },
    { text: 'Analytics', icon: '📈', path: '/analytics' },
    { text: 'System', icon: '⚙️', path: '/settings' },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen(true)}
            sx={{ mr: 2 }}
          >
            ☰
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Analytics - Admin Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            🚪 Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            {menuItems.map((item) => (
              <ListItem
                key={item.text}
                onClick={() => {
                  navigate(item.path);
                  setDrawerOpen(false);
                }}
                sx={{ cursor: 'pointer' }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          backgroundColor: 'background.default',
          minHeight: '100vh',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom>
            System Analytics
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Key Metrics */}
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Total Users
                  </Typography>
                  <Typography variant="h3" color="primary">
                    {analytics.totalUsers || 0}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    +{analytics.userGrowth || 0}% this month
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Therapists
                  </Typography>
                  <Typography variant="h3" color="warning.main">
                    {analytics.totalTherapists || 0}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    +{analytics.therapistGrowth || 0}% this month
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Appointments
                  </Typography>
                  <Typography variant="h3" color="secondary">
                    {analytics.totalAppointments || 0}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    +{analytics.appointmentGrowth || 0}% this month
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Revenue
                  </Typography>
                  <Typography variant="h3" color="success.main">
                    ${analytics.revenue || 0}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    +{analytics.monthlyGrowth || 0}% this month
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Appointment Status */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Appointment Status
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box textAlign="center">
                        <Typography variant="h4" color="success.main">
                          {analytics.activeSessions || 0}
                        </Typography>
                        <Typography variant="body2">Active Sessions</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box textAlign="center">
                        <Typography variant="h4" color="info.main">
                          {analytics.completedSessions || 0}
                        </Typography>
                        <Typography variant="body2">Completed</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box textAlign="center">
                        <Typography variant="h4" color="warning.main">
                          {analytics.pendingAppointments || 0}
                        </Typography>
                        <Typography variant="body2">Pending</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box textAlign="center">
                        <Typography variant="h4" color="error">
                          {analytics.cancelledAppointments || 0}
                        </Typography>
                        <Typography variant="body2">Cancelled</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Top Therapists */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Top Performing Therapists
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Therapist</TableCell>
                          <TableCell>Appointments</TableCell>
                          <TableCell>Rating</TableCell>
                          <TableCell>Patients</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(analytics.topTherapists || []).map((therapist, index) => (
                          <TableRow key={index}>
                            <TableCell>{therapist.name}</TableCell>
                            <TableCell>
                              <Chip label={therapist.appointments} color="primary" size="small" />
                            </TableCell>
                            <TableCell>
                              <Chip label={`${therapist.rating}⭐`} color="warning" size="small" />
                            </TableCell>
                            <TableCell>{therapist.patients}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Recent Activity */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Activity
                  </Typography>
                  <Box>
                    {(analytics.recentActivity || []).map((activity, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Chip 
                          label={activity.type} 
                          color={activity.type === 'appointment' ? 'primary' : 
                                 activity.type === 'user' ? 'success' : 'warning'}
                          size="small"
                          sx={{ mr: 2, minWidth: 80 }}
                        />
                        <Typography variant="body2" sx={{ flexGrow: 1 }}>
                          {activity.message}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {activity.time}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Monthly Statistics */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Monthly Statistics (Last 6 Months)
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Month</TableCell>
                          <TableCell>Appointments</TableCell>
                          <TableCell>Revenue</TableCell>
                          <TableCell>Growth</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.entries(analytics.monthlyStats || {}).map(([month, stats]) => (
                          <TableRow key={month}>
                            <TableCell>
                              <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
                                {month}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip label={stats.appointments} color="info" size="small" />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="success.main">
                                ${stats.revenue}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label="+12.5%" 
                                color="success" 
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default AdminAnalytics; 