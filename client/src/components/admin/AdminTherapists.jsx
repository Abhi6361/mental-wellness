import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  IconButton,
  CircularProgress,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authAPI, adminAPI } from '../../services/api';

const AdminTherapists = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [therapistDialog, setTherapistDialog] = useState(false);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    loadTherapists();
  }, []);

  const loadTherapists = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getTherapists();
      setTherapists(response.data.therapists || []);
    } catch (error) {
      console.error('Error loading therapists:', error);
      setError('Failed to load therapists');
      // Mock data for demo
      setTherapists([
        { 
          id: 1, 
          name: 'Dr. Sarah Johnson', 
          email: 'sarah@therapy.com', 
          specialization: 'Anxiety & Depression', 
          status: 'active', 
          experience: '8 years',
          patients: 12,
          rating: 4.8,
          createdAt: '2024-01-10' 
        },
        { 
          id: 2, 
          name: 'Dr. Michael Chen', 
          email: 'michael@therapy.com', 
          specialization: 'Trauma & PTSD', 
          status: 'active', 
          experience: '12 years',
          patients: 8,
          rating: 4.9,
          createdAt: '2024-01-15' 
        },
        { 
          id: 3, 
          name: 'Dr. Emily Rodriguez', 
          email: 'emily@therapy.com', 
          specialization: 'Family Therapy', 
          status: 'inactive', 
          experience: '6 years',
          patients: 5,
          rating: 4.7,
          createdAt: '2024-01-20' 
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    navigate('/login');
  };

  const handleAddTherapist = () => {
    setSelectedTherapist({
      name: '',
      email: '',
      specialization: '',
      status: 'active',
      experience: '',
      password: ''
    });
    setIsEdit(false);
    setTherapistDialog(true);
  };

  const handleEditTherapist = (therapist) => {
    setSelectedTherapist({ ...therapist });
    setIsEdit(true);
    setTherapistDialog(true);
  };

  const handleDeleteTherapist = async (therapistId) => {
    if (window.confirm('Are you sure you want to delete this therapist?')) {
      try {
        await adminAPI.deleteTherapist(therapistId);
        setTherapists(prev => prev.filter(therapist => therapist.id !== therapistId));
        setSuccess('Therapist deleted successfully');
      } catch (error) {
        setError('Failed to delete therapist');
        // Mock deletion for demo
        setTherapists(prev => prev.filter(therapist => therapist.id !== therapistId));
        setSuccess('Therapist deleted successfully');
      }
    }
  };

  const handleSaveTherapist = async () => {
    try {
      if (isEdit) {
        await adminAPI.updateTherapist(selectedTherapist.id, selectedTherapist);
        setTherapists(prev => 
          prev.map(therapist => 
            therapist.id === selectedTherapist.id ? selectedTherapist : therapist
          )
        );
        setSuccess('Therapist updated successfully');
      } else {
        const response = await adminAPI.createTherapist(selectedTherapist);
        setTherapists(prev => [...prev, response.data.therapist]);
        setSuccess('Therapist created successfully');
      }
      setTherapistDialog(false);
      setSelectedTherapist(null);
    } catch (error) {
      setError('Failed to save therapist');
      // Mock save for demo
      if (isEdit) {
        setTherapists(prev => 
          prev.map(therapist => 
            therapist.id === selectedTherapist.id ? selectedTherapist : therapist
          )
        );
      } else {
        const newTherapist = { 
          ...selectedTherapist, 
          id: Date.now(), 
          patients: 0,
          rating: 0,
          createdAt: new Date().toISOString().split('T')[0] 
        };
        setTherapists(prev => [...prev, newTherapist]);
      }
      setSuccess(isEdit ? 'Therapist updated successfully' : 'Therapist created successfully');
      setTherapistDialog(false);
      setSelectedTherapist(null);
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'success' : 'error';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
            Manage Therapists - Admin Dashboard
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
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" gutterBottom>
              Manage Therapists
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddTherapist}
            >
              Add New Therapist
            </Button>
          </Box>

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

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Therapist List ({therapists.length} therapists)
              </Typography>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Specialization</TableCell>
                      <TableCell>Experience</TableCell>
                      <TableCell>Patients</TableCell>
                      <TableCell>Rating</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Joined</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {therapists.map((therapist) => (
                      <TableRow key={therapist.id}>
                        <TableCell>{therapist.name}</TableCell>
                        <TableCell>{therapist.email}</TableCell>
                        <TableCell>{therapist.specialization}</TableCell>
                        <TableCell>{therapist.experience}</TableCell>
                        <TableCell>
                          <Chip 
                            label={therapist.patients} 
                            color="info"
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={`${therapist.rating}⭐`} 
                            color="warning"
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={therapist.status} 
                            color={getStatusColor(therapist.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{formatDate(therapist.createdAt)}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleEditTherapist(therapist)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              onClick={() => handleDeleteTherapist(therapist.id)}
                            >
                              Delete
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Container>
      </Box>

      {/* Add/Edit Therapist Dialog */}
      <Dialog open={therapistDialog} onClose={() => setTherapistDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{isEdit ? 'Edit Therapist' : 'Add New Therapist'}</DialogTitle>
        <DialogContent>
          {selectedTherapist && (
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Name"
                value={selectedTherapist.name}
                onChange={(e) => setSelectedTherapist({ ...selectedTherapist, name: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label="Email"
                type="email"
                value={selectedTherapist.email}
                onChange={(e) => setSelectedTherapist({ ...selectedTherapist, email: e.target.value })}
                fullWidth
                required
              />
              {!isEdit && (
                <TextField
                  label="Password"
                  type="password"
                  value={selectedTherapist.password || ''}
                  onChange={(e) => setSelectedTherapist({ ...selectedTherapist, password: e.target.value })}
                  fullWidth
                  required
                />
              )}
              <TextField
                label="Specialization"
                value={selectedTherapist.specialization}
                onChange={(e) => setSelectedTherapist({ ...selectedTherapist, specialization: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label="Experience"
                value={selectedTherapist.experience}
                onChange={(e) => setSelectedTherapist({ ...selectedTherapist, experience: e.target.value })}
                fullWidth
                placeholder="e.g., 5 years"
                required
              />
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedTherapist.status}
                  onChange={(e) => setSelectedTherapist({ ...selectedTherapist, status: e.target.value })}
                  label="Status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTherapistDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveTherapist} variant="contained">
            {isEdit ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminTherapists; 