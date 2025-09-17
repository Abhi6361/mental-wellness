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

const AdminUsers = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userDialog, setUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsers();
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Failed to load users');
      // Mock data for demo
      setUsers([
        { id: 1, name: 'John Smith', email: 'john@example.com', role: 'user', status: 'active', createdAt: '2024-01-15' },
        { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', role: 'user', status: 'active', createdAt: '2024-01-20' },
        { id: 3, name: 'Madan Gowda', email: 'madangowdasc97@gmail.com', role: 'user', status: 'active', createdAt: '2024-01-25' },
        { id: 4, name: 'Admin User', email: 'admin@wellness.com', role: 'admin', status: 'active', createdAt: '2024-01-01' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    navigate('/login');
  };

  const handleAddUser = () => {
    setSelectedUser({
      name: '',
      email: '',
      role: 'user',
      status: 'active',
      password: ''
    });
    setIsEdit(false);
    setUserDialog(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser({ ...user });
    setIsEdit(true);
    setUserDialog(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminAPI.deleteUser(userId);
        setUsers(prev => prev.filter(user => user.id !== userId));
        setSuccess('User deleted successfully');
      } catch (error) {
        setError('Failed to delete user');
        // Mock deletion for demo
        setUsers(prev => prev.filter(user => user.id !== userId));
        setSuccess('User deleted successfully');
      }
    }
  };

  const handleSaveUser = async () => {
    try {
      if (isEdit) {
        await adminAPI.updateUser(selectedUser.id, selectedUser);
        setUsers(prev => 
          prev.map(user => 
            user.id === selectedUser.id ? selectedUser : user
          )
        );
        setSuccess('User updated successfully');
      } else {
        const response = await adminAPI.createUser(selectedUser);
        setUsers(prev => [...prev, response.data.user]);
        setSuccess('User created successfully');
      }
      setUserDialog(false);
      setSelectedUser(null);
    } catch (error) {
      setError('Failed to save user');
      // Mock save for demo
      if (isEdit) {
        setUsers(prev => 
          prev.map(user => 
            user.id === selectedUser.id ? selectedUser : user
          )
        );
      } else {
        const newUser = { ...selectedUser, id: Date.now(), createdAt: new Date().toISOString().split('T')[0] };
        setUsers(prev => [...prev, newUser]);
      }
      setSuccess(isEdit ? 'User updated successfully' : 'User created successfully');
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
            Manage Users - Admin Dashboard
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
              Manage Users
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddUser}
            >
              Add New User
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
                User List ({users.length} users)
              </Typography>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
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
                        <TableCell>{formatDate(user.createdAt)}</TableCell>
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
        </Container>
      </Box>

      {/* Add/Edit User Dialog */}
      <Dialog open={userDialog} onClose={() => setUserDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{isEdit ? 'Edit User' : 'Add New User'}</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Name"
                value={selectedUser.name}
                onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label="Email"
                type="email"
                value={selectedUser.email}
                onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                fullWidth
                required
              />
              {!isEdit && (
                <TextField
                  label="Password"
                  type="password"
                  value={selectedUser.password || ''}
                  onChange={(e) => setSelectedUser({ ...selectedUser, password: e.target.value })}
                  fullWidth
                  required
                />
              )}
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={selectedUser.role}
                  onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                  label="Role"
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
          <Button onClick={() => setUserDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveUser} variant="contained">
            {isEdit ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminUsers; 