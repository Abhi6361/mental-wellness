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
import { useNavigate, Link } from 'react-router-dom';
import { userAPI } from '../../services/api';

const MyAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelDialog, setCancelDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAppointments();
      console.log('Loaded appointments:', response.data.appointments);
      setAppointments(response.data.appointments || []);
    } catch (err) {
      setError('Failed to load appointments');
      console.error('Error loading appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setCancelDialog(true);
  };

  const confirmCancel = async () => {
    if (!cancelReason.trim()) {
      setError('Please provide a reason for cancellation');
      return;
    }

    try {
      // Call the API to cancel the appointment
      await userAPI.updateAppointment(selectedAppointment.id, {
        status: 'cancelled',
        notes: `Cancelled: ${cancelReason}`
      });
      
      // Reload appointments to get updated data
      await loadAppointments();
      
      setCancelDialog(false);
      setSelectedAppointment(null);
      setCancelReason('');
      setError('');
    } catch (err) {
      setError('Failed to cancel appointment');
      console.error('Error cancelling appointment:', err);
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

  const canCancel = (appointment) => {
    const appointmentDate = new Date(appointment.date);
    const now = new Date();
    const hoursDifference = (appointmentDate - now) / (1000 * 60 * 60);
    
    return appointment.status === 'confirmed' || appointment.status === 'pending';
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
          My Appointments
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/appointments')}
        >
          Book New Appointment
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Debug Info */}
      <Alert severity="info" sx={{ mb: 2 }}>
        Debug: Found {appointments.length} appointments. Statuses: {appointments.map(a => a.status).join(', ')}
      </Alert>

      {appointments.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" gutterBottom>
              No Appointments Found
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              You don't have any appointments scheduled yet.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/appointments')}
            >
              Book Your First Appointment
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Upcoming & Past Appointments
                </Typography>
                <List>
                  {appointments.map((appointment, index) => (
                    <React.Fragment key={appointment.id}>
                      <ListItem>
                        <ListItemText
                          primary={
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                              <Typography variant="subtitle1">
                                {appointment.type} with {appointment.therapistName || 'Therapist'}
                              </Typography>
                              <Box display="flex" alignItems="center" gap={1}>
                                <Chip
                                  label={appointment.status}
                                  color={getStatusColor(appointment.status)}
                                  size="small"
                                />
                                {canCancel(appointment) && (
                                  <Button
                                    size="small"
                                    color="error"
                                    variant="outlined"
                                    onClick={() => handleCancelAppointment(appointment)}
                                  >
                                    Cancel
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

      {/* Cancel Appointment Dialog */}
      <Dialog open={cancelDialog} onClose={() => setCancelDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Cancel Appointment</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Are you sure you want to cancel your appointment on {selectedAppointment && formatDate(selectedAppointment.date)} at {selectedAppointment?.time}?
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Reason for cancellation (optional)"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Please provide a reason for cancellation..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialog(false)}>Keep Appointment</Button>
          <Button onClick={confirmCancel} color="error" variant="contained">
            Cancel Appointment
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyAppointments; 