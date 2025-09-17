import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { therapistAPI } from '../../services/api';

const TherapistAvailability = () => {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [addDialog, setAddDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [formData, setFormData] = useState({
    day: '',
    startTime: '',
    endTime: '',
  });

  const daysOfWeek = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
  ];

  useEffect(() => {
    loadAvailability();
  }, []);

  const loadAvailability = async () => {
    try {
      setLoading(true);
      const response = await therapistAPI.getAvailability();
      setAvailability(response.data.availability || []);
    } catch (err) {
      setError('Failed to load availability');
      console.error('Error loading availability:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAvailability = async () => {
    if (!formData.day || !formData.startTime || !formData.endTime) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await therapistAPI.addAvailability({
        therapistId: 2, // Dr. Sarah Johnson
        ...formData
      });
      
      setAvailability(prev => [...prev, response.data.availability]);
      setAddDialog(false);
      resetForm();
      setSuccess('Availability added successfully!');
      setError('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to add availability');
      console.error('Error adding availability:', err);
    }
  };

  const handleEditAvailability = async () => {
    if (!formData.day || !formData.startTime || !formData.endTime) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await therapistAPI.updateAvailability(selectedSlot.id, {
        therapistId: 2, // Dr. Sarah Johnson
        ...formData
      });
      
      setAvailability(prev => prev.map(slot => 
        slot.id === selectedSlot.id ? response.data.availability : slot
      ));
      setEditDialog(false);
      resetForm();
      setSelectedSlot(null);
      setSuccess('Availability updated successfully!');
      setError('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update availability');
      console.error('Error updating availability:', err);
    }
  };

  const handleDeleteAvailability = async (id) => {
    try {
      await therapistAPI.deleteAvailability(id);
      setAvailability(prev => prev.filter(slot => slot.id !== id));
      setSuccess('Availability deleted successfully!');
      setError('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete availability');
      console.error('Error deleting availability:', err);
    }
  };

  const handleEdit = (slot) => {
    setSelectedSlot(slot);
    setFormData({
      day: slot.day,
      startTime: slot.startTime,
      endTime: slot.endTime,
    });
    setEditDialog(true);
  };

  const resetForm = () => {
    setFormData({
      day: '',
      startTime: '',
      endTime: '',
    });
    setError('');
  };

  const getDayDisplayName = (day) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  const getStatusColor = (day) => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    return day === today ? 'success' : 'default';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Set Availability
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setAddDialog(true)}
        >
          Add Time Slot
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

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current Availability
              </Typography>
              {availability.length === 0 ? (
                <Typography variant="body2" color="textSecondary">
                  No availability set. Add your working hours to start receiving appointments.
                </Typography>
              ) : (
                <List>
                  {availability.map((slot) => (
                    <ListItem key={slot.id}>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Chip
                              label={getDayDisplayName(slot.day)}
                              color={getStatusColor(slot.day)}
                              size="small"
                            />
                            <Typography variant="body1">
                              {slot.startTime} - {slot.endTime}
                            </Typography>
                          </Box>
                        }
                        secondary={`Available for appointments on ${getDayDisplayName(slot.day)}s`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => handleEdit(slot)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          onClick={() => handleDeleteAvailability(slot.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Availability Dialog */}
      <Dialog open={addDialog} onClose={() => setAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Availability</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Day of Week</InputLabel>
              <Select
                value={formData.day}
                onChange={(e) => setFormData(prev => ({ ...prev, day: e.target.value }))}
                label="Day of Week"
              >
                {daysOfWeek.map((day) => (
                  <MenuItem key={day} value={day}>
                    {getDayDisplayName(day)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              type="time"
              label="Start Time"
              value={formData.startTime}
              onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              type="time"
              label="End Time"
              value={formData.endTime}
              onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setAddDialog(false); resetForm(); }}>
            Cancel
          </Button>
          <Button onClick={handleAddAvailability} variant="contained">
            Add Availability
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Availability Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Availability</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Day of Week</InputLabel>
              <Select
                value={formData.day}
                onChange={(e) => setFormData(prev => ({ ...prev, day: e.target.value }))}
                label="Day of Week"
              >
                {daysOfWeek.map((day) => (
                  <MenuItem key={day} value={day}>
                    {getDayDisplayName(day)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              type="time"
              label="Start Time"
              value={formData.startTime}
              onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              type="time"
              label="End Time"
              value={formData.endTime}
              onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setEditDialog(false); resetForm(); setSelectedSlot(null); }}>
            Cancel
          </Button>
          <Button onClick={handleEditAvailability} variant="contained">
            Update Availability
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TherapistAvailability; 