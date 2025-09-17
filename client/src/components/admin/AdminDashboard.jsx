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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authAPI, adminAPI } from '../../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [users, setUsers] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [userDialog, setUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setAdmin(userData);
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load users
      const usersResponse = await adminAPI.getUsers();
      setUsers(usersResponse.data.users || []);
      
      // Load therapists
      const therapistsResponse = await adminAPI.getTherapists();
      setTherapists(therapistsResponse.data.therapists || []);
      
      // Load analytics
      const analyticsResponse = await adminAPI.getAnalytics();
      setAnalytics(analyticsResponse.data.analytics || {});
      
    } catch (error) {
      console.error('Error loading admin data:', error);
      // Mock data for demo
      setUsers([
        { id: 1, name: 'John Smith', email: 'john@example.com', role: 'user', status: 'active' },
        { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', role: 'user', status: 'active' },
        { id: 3, name: 'Madan Gowda', email: 'madangowdasc97@gmail.com', role: 'user', status: 'active' },
      ]);
      
      setTherapists([
        { id: 1, name: 'Dr. Sarah Johnson', email: 'sarah@therapy.com', specialization: 'Anxiety & Depression', status: 'active' },
        { id: 2, name: 'Dr. Michael Chen', email: 'michael@therapy.com', specialization: 'Trauma & PTSD', status: 'active' },
      ]);
      
      setAnalytics({
        totalUsers: 3,
        totalTherapists: 2,
        totalAdmins: 1,
        totalAppointments: 15,
        activeSessions: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    navigate('/login');
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setUserDialog(true);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

  const handleSaveUser = () => {
    if (selectedUser) {
      setUsers(prev => 
        prev.map(user => 
          user.id === selectedUser.id ? selectedUser : user
        )
      );
      setUserDialog(false);
      setSelectedUser(null);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'error';
      case 'therapist': return 'warning';
      case 'user': return 'primary';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'success' : 'error';
  };

  const menuItems = [
    { text: 'Dashboard', icon: '📊', path: '/admin/dashboard' },
    { text: 'Users', icon: '👥', path: '/admin/users' },
    { text: 'Therapists', icon: '👨‍⚕️', path: '/admin/therapists' },
    { text: 'Analytics', icon: '📈', path: '/admin/analytics' },
    { text: 'System', icon: '⚙️', path: '/admin/system' },
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
            Mental Wellness Platform - Admin Dashboard
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
            Welcome, {admin?.name || 'Admin'}!
          </Typography>
          
          {loading && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Loading data...
            </Alert>
          )}
          
          <Grid container spacing={3}>
            {/* Quick Stats */}
            <Grid item xs={12} md={2}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Total Users
                  </Typography>
                  <Typography variant="h3" color="primary">
                    {analytics.totalUsers || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Therapists
                  </Typography>
                  <Typography variant="h3" color="warning.main">
                    {analytics.totalTherapists || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Admins
                  </Typography>
                  <Typography variant="h3" color="error">
                    {analytics.totalAdmins || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Appointments
                  </Typography>
                  <Typography variant="h3" color="secondary">
                    {analytics.totalAppointments || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Active Sessions
                  </Typography>
                  <Typography variant="h3" color="success.main">
                    {analytics.activeSessions || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    System Status
                  </Typography>
                  <Chip label="Online" color="success" size="small" />
                </CardContent>
              </Card>
            </Grid>

            {/* Users Table */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Users
                  </Typography>
                  
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Email</TableCell>
                          <TableCell>Role</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {users.slice(0, 5).map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Chip 
                                label={user.role} 
                                color={getRoleColor(user.role)}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={user.status} 
                                color={getStatusColor(user.status)}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() => handleEditUser(user)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  color="error"
                                  onClick={() => handleDeleteUser(user.id)}
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
            </Grid>

            {/* Therapists Table */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Therapists
                  </Typography>
                  
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Email</TableCell>
                          <TableCell>Specialization</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {therapists.map((therapist) => (
                          <TableRow key={therapist.id}>
                            <TableCell>{therapist.name}</TableCell>
                            <TableCell>{therapist.email}</TableCell>
                            <TableCell>{therapist.specialization}</TableCell>
                            <TableCell>
                              <Chip 
                                label={therapist.status} 
                                color={getStatusColor(therapist.status)}
                                size="small"
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

      {/* Edit User Dialog */}
      <Dialog open={userDialog} onClose={() => setUserDialog(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Name"
                value={selectedUser.name}
                onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                fullWidth
              />
              <TextField
                label="Email"
                value={selectedUser.email}
                onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={selectedUser.role}
                  onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="therapist">Therapist</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedUser.status}
                  onChange={(e) => setSelectedUser({ ...selectedUser, status: e.target.value })}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveUser} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard; 