import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { therapistAPI } from '../../services/api';
import { Link } from 'react-router-dom';

const TherapistAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [statusNote, setStatusNote] = useState('');

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const response = await therapistAPI.getAppointments();
      console.log('Loaded therapist appointments:', response.data.appointments);
      setAppointments(response.data.appointments || []);
    } catch (err) {
      setError('Failed to load appointments');
      console.error('Error loading appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = (appointment, newStatus) => {
    setSelectedAppointment(appointment);
    setStatusNote('');
    setConfirmDialog(true);
  };

  const confirmUpdate = async () => {
    try {
      await therapistAPI.updateAppointment(selectedAppointment.id, {
        status: selectedAppointment.status,
        notes: statusNote ? `${selectedAppointment.notes || ''}\n${statusNote}` : selectedAppointment.notes
      });
      
      await loadAppointments();
      setConfirmDialog(false);
      setSelectedAppointment(null);
      setStatusNote('');
      setError('');
    } catch (err) {
      setError('Failed to update appointment');
      console.error('Error updating appointment:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      case 'completed':
        return 'info';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const canUpdateStatus = (appointment) => {
    return appointment.status === 'pending' || appointment.status === 'confirmed';
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
      <Typography variant="h4" component="h1" gutterBottom>
        My Appointments
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {appointments.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" gutterBottom>
              No Appointments Found
            </Typography>
            <Typography variant="body2" color="textSecondary">
              You don't have any appointments scheduled yet.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Patient Appointments
                </Typography>
                <List>
                  {appointments.map((appointment, index) => (
                    <React.Fragment key={appointment.id}>
                      <ListItem>
                        <ListItemText
                          primary={
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                              <Typography variant="subtitle1">
                                {appointment.patientName} - {appointment.type}
                              </Typography>
                              <Box display="flex" alignItems="center" gap={1}>
                                <Chip
                                  label={appointment.status}
                                  color={getStatusColor(appointment.status)}
                                  size="small"
                                />
                                {canUpdateStatus(appointment) && (
                                  <Button
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                    onClick={() => handleUpdateStatus(
                                      { ...appointment, status: appointment.status === 'pending' ? 'confirmed' : 'completed' },
                                      appointment.status === 'pending' ? 'confirmed' : 'completed'
                                    )}
                                  >
                                    {appointment.status === 'pending' ? 'Confirm' : 'Mark Complete'}
                                  </Button>
                                )}
                                <Button
                                  variant="contained"
                                  color="primary"
                                  component={Link}
                                  to={`/meeting/${appointment.id}`}
                                  disabled={false}
                                  sx={{ 
                                    ml: 2, 
                                    backgroundColor: '#1976d2',
                                    color: 'white',
                                    '&:hover': {
                                      backgroundColor: '#1565c0'
                                    }
                                  }}
                                  onClick={() => console.log('Join Meeting clicked for appointment:', appointment.id)}
                                >
                                  🎥 Join Meeting
                                </Button>
                              </Box>
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2">
                                📅 {formatDate(appointment.date)} at {appointment.time}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                📧 {appointment.patientEmail}
                              </Typography>
                              {appointment.notes && (
                                <Typography variant="body2" color="textSecondary">
                                  📝 {appointment.notes}
                                </Typography>
                              )}
                              <Typography variant="body2" color="textSecondary">
                                🏥 Appointment ID: #{appointment.id}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < appointments.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Update Status Dialog */}
      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedAppointment?.status === 'pending' ? 'Confirm Appointment' : 'Mark Appointment Complete'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {selectedAppointment?.status === 'pending' 
              ? `Are you sure you want to confirm the appointment with ${selectedAppointment?.patientName} on ${selectedAppointment && formatDate(selectedAppointment.date)} at ${selectedAppointment?.time}?`
              : `Are you sure you want to mark the appointment with ${selectedAppointment?.patientName} as completed?`
            }
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Additional Notes (Optional)"
            value={statusNote}
            onChange={(e) => setStatusNote(e.target.value)}
            placeholder="Add any notes about this appointment..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>Cancel</Button>
          <Button onClick={confirmUpdate} color="primary" variant="contained">
            {selectedAppointment?.status === 'pending' ? 'Confirm Appointment' : 'Mark Complete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TherapistAppointments; 