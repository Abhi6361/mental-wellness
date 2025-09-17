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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authAPI, therapistAPI } from '../../services/api';

const TherapistDashboard = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [therapist, setTherapist] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [availabilityDialog, setAvailabilityDialog] = useState(false);
  const [newAvailability, setNewAvailability] = useState({
    day: '',
    startTime: '',
    endTime: '',
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setTherapist(userData);
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const response = await therapistAPI.getAppointments();
      setAppointments(response.data.appointments || []);
    } catch (error) {
      console.error('Error loading appointments:', error);
      // Mock data for demo
      setAppointments([
        {
          id: 1,
          patientName: 'John Smith',
          date: '2024-06-25',
          time: '10:00 AM',
          status: 'confirmed',
          type: 'Initial Consultation'
        },
        {
          id: 2,
          patientName: 'Sarah Johnson',
          date: '2024-06-25',
          time: '2:00 PM',
          status: 'pending',
          type: 'Follow-up'
        }
      ]);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    navigate('/login');
  };

  const handleAcceptAppointment = (appointmentId) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: 'confirmed' }
          : apt
      )
    );
  };

  const handleRejectAppointment = (appointmentId) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: 'rejected' }
          : apt
      )
    );
  };

  const handleAddAvailability = () => {
    // In a real app, this would save to the backend
    setAvailabilityDialog(false);
    setNewAvailability({ day: '', startTime: '', endTime: '' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const menuItems = [
    { text: 'Dashboard', icon: '📊', path: '/therapist/dashboard' },
    { text: 'Appointments', icon: '📅', path: '/therapist/appointments' },
    { text: 'Patients', icon: '👥', path: '/therapist/patients' },
    { text: 'Availability', icon: '⏰', path: '/therapist/availability' },
    { text: 'Profile', icon: '👤', path: '/therapist/profile' },
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
            Mental Wellness Platform - Therapist Dashboard
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
          <Typography variant="h4" gutterBottom>
            Welcome, {therapist?.name || 'Therapist'}!
          </Typography>
          
          <Grid container spacing={3}>
            {/* Quick Stats */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Today's Appointments
                  </Typography>
                  <Typography variant="h3" color="primary">
                    {appointments.filter(apt => apt.status === 'confirmed').length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Pending Requests
                  </Typography>
                  <Typography variant="h3" color="warning.main">
                    {appointments.filter(apt => apt.status === 'pending').length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Total Patients
                  </Typography>
                  <Typography variant="h3" color="secondary">
                    {new Set(appointments.map(apt => apt.patientName)).size}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Appointments Table */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      Recent Appointments
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => setAvailabilityDialog(true)}
                    >
                      Set Availability
                    </Button>
                  </Box>
                  
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Patient</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Time</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {appointments.map((appointment) => (
                          <TableRow key={appointment.id}>
                            <TableCell>{appointment.patientName}</TableCell>
                            <TableCell>{appointment.date}</TableCell>
                            <TableCell>{appointment.time}</TableCell>
                            <TableCell>{appointment.type}</TableCell>
                            <TableCell>
                              <Chip 
                                label={appointment.status} 
                                color={getStatusColor(appointment.status)}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              {appointment.status === 'pending' && (
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <Button
                                    size="small"
                                    variant="contained"
                                    color="success"
                                    onClick={() => handleAcceptAppointment(appointment.id)}
                                  >
                                    Accept
                                  </Button>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    color="error"
                                    onClick={() => handleRejectAppointment(appointment.id)}
                                  >
                                    Reject
                                  </Button>
                                </Box>
                              )}
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

      {/* Availability Dialog */}
      <Dialog open={availabilityDialog} onClose={() => setAvailabilityDialog(false)}>
        <DialogTitle>Set Availability</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Day</InputLabel>
              <Select
                value={newAvailability.day}
                onChange={(e) => setNewAvailability({ ...newAvailability, day: e.target.value })}
              >
                <MenuItem value="monday">Monday</MenuItem>
                <MenuItem value="tuesday">Tuesday</MenuItem>
                <MenuItem value="wednesday">Wednesday</MenuItem>
                <MenuItem value="thursday">Thursday</MenuItem>
                <MenuItem value="friday">Friday</MenuItem>
                <MenuItem value="saturday">Saturday</MenuItem>
                <MenuItem value="sunday">Sunday</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              label="Start Time"
              type="time"
              value={newAvailability.startTime}
              onChange={(e) => setNewAvailability({ ...newAvailability, startTime: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            
            <TextField
              label="End Time"
              type="time"
              value={newAvailability.endTime}
              onChange={(e) => setNewAvailability({ ...newAvailability, endTime: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAvailabilityDialog(false)}>Cancel</Button>
          <Button onClick={handleAddAvailability} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TherapistDashboard; 