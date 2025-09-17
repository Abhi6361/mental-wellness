import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authAPI } from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
  }, []);

  const handleLogout = () => {
    authAPI.logout();
    navigate('/login');
  };

  // Menu items based on user role
  const getMenuItems = () => {
    const baseItems = [
      { text: 'Dashboard', icon: '📊', path: '/dashboard' },
      { text: 'Chat with AI', icon: '💬', path: '/chat' },
      { text: 'Profile', icon: '👤', path: '/profile' },
    ];

    if (user?.role === 'user') {
      return [
        ...baseItems,
        { text: 'Book Appointment', icon: '📅', path: '/appointments' },
        { text: 'My Appointments', icon: '📋', path: '/my-appointments' },
      ];
    } else if (user?.role === 'therapist') {
      return [
        ...baseItems,
        { text: 'My Patients', icon: '👥', path: '/patients' },
        { text: 'My Appointments', icon: '📅', path: '/therapist-appointments' },
        { text: 'Availability', icon: '⏰', path: '/availability' },
      ];
    } else if (user?.role === 'admin') {
      return [
        ...baseItems,
        { text: 'Manage Users', icon: '👥', path: '/users' },
        { text: 'Manage Therapists', icon: '👨‍⚕️', path: '/therapists' },
        { text: 'Analytics', icon: '📈', path: '/analytics' },
        { text: 'System Settings', icon: '⚙️', path: '/settings' },
      ];
    }

    return baseItems;
  };

  const getRoleColor = () => {
    switch (user?.role) {
      case 'admin':
        return 'error';
      case 'therapist':
        return 'warning';
      case 'user':
        return 'primary';
      default:
        return 'default';
    }
  };

  const getRoleDisplayName = () => {
    switch (user?.role) {
      case 'admin':
        return 'Administrator';
      case 'therapist':
        return 'Therapist';
      case 'user':
        return 'User';
      default:
        return 'User';
    }
  };

  const getQuickActions = () => {
    if (user?.role === 'user') {
      return [
        {
          title: 'Book Therapy Session',
          description: 'Schedule a new appointment with a therapist',
          icon: '📅',
          action: () => navigate('/appointments'),
          color: 'primary'
        },
        {
          title: 'Chat with AI Assistant',
          description: 'Get immediate support and guidance',
          icon: '💬',
          action: () => navigate('/chat'),
          color: 'secondary'
        },
        {
          title: 'View My Appointments',
          description: 'Check your upcoming and past sessions',
          icon: '📋',
          action: () => navigate('/my-appointments'),
          color: 'info'
        }
      ];
    } else if (user?.role === 'therapist') {
      return [
        {
          title: 'View Patients',
          description: 'Manage your patient list and records',
          icon: '👥',
          action: () => navigate('/patients'),
          color: 'primary'
        },
        {
          title: 'Appointments',
          description: 'View and manage your appointments',
          icon: '📅',
          action: () => navigate('/therapist-appointments'),
          color: 'secondary'
        },
        {
          title: 'Set Availability',
          description: 'Update your working hours and availability',
          icon: '⏰',
          action: () => navigate('/availability'),
          color: 'info'
        }
      ];
    } else if (user?.role === 'admin') {
      return [
        {
          title: 'Manage Users',
          description: 'View and manage all user accounts',
          icon: '👥',
          action: () => navigate('/users'),
          color: 'primary'
        },
        {
          title: 'Manage Therapists',
          description: 'Oversee therapist accounts and profiles',
          icon: '👨‍⚕️',
          action: () => navigate('/therapists'),
          color: 'secondary'
        },
        {
          title: 'View Analytics',
          description: 'Access system statistics and reports',
          icon: '📈',
          action: () => navigate('/analytics'),
          color: 'info'
        }
      ];
    }

    return [];
  };

  const getRecentActivity = () => {
    if (user?.role === 'user') {
      return [
        { text: 'No recent appointments', time: 'Just now' },
        { text: 'Welcome to the platform!', time: 'Today' }
      ];
    } else if (user?.role === 'therapist') {
      return [
        { text: 'No pending appointments', time: 'Just now' },
        { text: 'Welcome back, Doctor!', time: 'Today' }
      ];
    } else if (user?.role === 'admin') {
      return [
        { text: 'System running smoothly', time: 'Just now' },
        { text: 'Welcome, Administrator!', time: 'Today' }
      ];
    }

    return [];
  };

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
            Mental Wellness Platform - {getRoleDisplayName()} Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip 
              label={getRoleDisplayName()} 
              color={getRoleColor()} 
              size="small" 
            />
            <Button color="inherit" onClick={handleLogout}>
              🚪 Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 250 }} role="presentation">
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                mx: 'auto',
                mb: 1,
                bgcolor: 'primary.main',
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Avatar>
            <Typography variant="subtitle1" gutterBottom>
              {user?.name || 'User'}
            </Typography>
            <Chip 
              label={getRoleDisplayName()} 
              color={getRoleColor()} 
              size="small" 
            />
          </Box>
          <Divider />
          <List>
            {getMenuItems().map((item) => (
              <ListItem
                button
                key={item.text}
                onClick={() => {
                  navigate(item.path);
                  setDrawerOpen(false);
                }}
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="h4" gutterBottom>
              Welcome back, {user?.name || 'User'}!
            </Typography>
            
            <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
              You're logged in as a {getRoleDisplayName().toLowerCase()}. Here's what you can do today.
            </Typography>
          </motion.div>
          
          <Grid container spacing={3}>
            {/* Quick Actions */}
            <Grid item xs={12} md={8}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Quick Actions
                    </Typography>
                    <Grid container spacing={2}>
                      {getQuickActions().map((action, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ 
                              scale: 1.05,
                              boxShadow: "0 8px 32px rgba(33,150,243,0.15)"
                            }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Card 
                              variant="outlined" 
                              sx={{ 
                                cursor: 'pointer',
                                '&:hover': { bgcolor: 'action.hover' }
                              }}
                              onClick={action.action}
                            >
                              <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" sx={{ mb: 1 }}>
                                  {action.icon}
                                </Typography>
                                <Typography variant="subtitle2" gutterBottom>
                                  {action.title}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                  {action.description}
                                </Typography>
                              </CardContent>
                            </Card>
                          </motion.div>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            
            {/* Recent Activity */}
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Recent Activity
                    </Typography>
                    {getRecentActivity().map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                      >
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2">
                            {activity.text}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {activity.time}
                          </Typography>
                        </Box>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard; 