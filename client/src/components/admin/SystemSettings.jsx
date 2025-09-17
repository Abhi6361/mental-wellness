import React, { useState } from 'react';
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
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';

const SystemSettings = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    emailNotifications: true,
    smsNotifications: false,
    sessionTimeout: 30,
    maxAppointmentsPerDay: 10,
    autoBackup: true,
    debugMode: false,
  });

  const handleLogout = () => {
    authAPI.logout();
    navigate('/login');
  };

  const handleSettingChange = (setting) => (event) => {
    setSettings(prev => ({
      ...prev,
      [setting]: event.target.checked !== undefined ? event.target.checked : event.target.value
    }));
  };

  const handleSaveSettings = () => {
    // In a real app, this would save to the backend
    console.log('Saving settings:', settings);
    alert('Settings saved successfully!');
  };

  const handleResetSettings = () => {
    // Reset to default values
    setSettings({
      maintenanceMode: false,
      emailNotifications: true,
      smsNotifications: false,
      sessionTimeout: 30,
      maxAppointmentsPerDay: 10,
      autoBackup: true,
      debugMode: false,
    });
    alert('Settings reset to defaults!');
  };

  const menuItems = [
    { text: 'Dashboard', icon: '📊', path: '/dashboard' },
    { text: 'Users', icon: '👥', path: '/users' },
    { text: 'Therapists', icon: '👨‍⚕️', path: '/therapists' },
    { text: 'Analytics', icon: '📈', path: '/analytics' },
    { text: 'System', icon: '⚙️', path: '/settings' },
  ];

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
            System Settings - Admin Dashboard
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
            System Settings
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
            Configure system-wide settings and preferences for the mental wellness platform.
          </Typography>

          <Grid container spacing={3}>
            {/* General Settings */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    General Settings
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.maintenanceMode}
                          onChange={handleSettingChange('maintenanceMode')}
                          color="warning"
                        />
                      }
                      label="Maintenance Mode"
                    />
                    <Typography variant="caption" display="block" color="textSecondary">
                      Enable maintenance mode to restrict access during updates
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mt: 3 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.debugMode}
                          onChange={handleSettingChange('debugMode')}
                          color="info"
                        />
                      }
                      label="Debug Mode"
                    />
                    <Typography variant="caption" display="block" color="textSecondary">
                      Enable detailed logging for troubleshooting
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 3 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.autoBackup}
                          onChange={handleSettingChange('autoBackup')}
                          color="success"
                        />
                      }
                      label="Auto Backup"
                    />
                    <Typography variant="caption" display="block" color="textSecondary">
                      Automatically backup system data daily
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Notification Settings */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Notification Settings
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.emailNotifications}
                          onChange={handleSettingChange('emailNotifications')}
                          color="primary"
                        />
                      }
                      label="Email Notifications"
                    />
                    <Typography variant="caption" display="block" color="textSecondary">
                      Send email notifications for important events
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mt: 3 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.smsNotifications}
                          onChange={handleSettingChange('smsNotifications')}
                          color="secondary"
                        />
                      }
                      label="SMS Notifications"
                    />
                    <Typography variant="caption" display="block" color="textSecondary">
                      Send SMS notifications for urgent alerts
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* System Configuration */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    System Configuration
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Session Timeout (minutes)</InputLabel>
                        <Select
                          value={settings.sessionTimeout}
                          onChange={handleSettingChange('sessionTimeout')}
                          label="Session Timeout (minutes)"
                        >
                          <MenuItem value={15}>15 minutes</MenuItem>
                          <MenuItem value={30}>30 minutes</MenuItem>
                          <MenuItem value={60}>1 hour</MenuItem>
                          <MenuItem value={120}>2 hours</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Max Appointments Per Day"
                        type="number"
                        value={settings.maxAppointmentsPerDay}
                        onChange={handleSettingChange('maxAppointmentsPerDay')}
                        sx={{ mt: 2 }}
                        InputProps={{ inputProps: { min: 1, max: 50 } }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* System Information */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    System Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                      <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4" color="primary">
                          5
                        </Typography>
                        <Typography variant="body2">Active Therapists</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4" color="success.main">
                          22
                        </Typography>
                        <Typography variant="body2">Total Appointments</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4" color="info.main">
                          7
                        </Typography>
                        <Typography variant="body2">Registered Users</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4" color="warning.main">
                          99.9%
                        </Typography>
                        <Typography variant="body2">Uptime</Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button variant="outlined" color="secondary" onClick={handleResetSettings}>
                  Reset to Defaults
                </Button>
                <Button variant="contained" color="primary" onClick={handleSaveSettings}>
                  Save Settings
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default SystemSettings; 