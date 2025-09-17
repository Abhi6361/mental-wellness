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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Chip,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { userAPI, therapistAPI } from '../../services/api';

const Appointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingDialog, setBookingDialog] = useState(false);
  const [selectedTherapist, setSelectedTherapist] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [appointmentsRes, therapistsRes] = await Promise.all([
        userAPI.getAppointments(),
        therapistAPI.getTherapists()
      ]);
      setAppointments(appointmentsRes.data.appointments || []);
      setTherapists(therapistsRes.data.therapists || []);
    } catch (err) {
      setError('Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedTherapist || !selectedDate || !selectedTime || !appointmentType) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const appointmentData = {
        therapistId: selectedTherapist,
        date: selectedDate,
        time: selectedTime,
        type: appointmentType,
        notes: notes,
      };

      await userAPI.bookAppointment(appointmentData);
      setSuccess('Appointment booked successfully!');
      setBookingDialog(false);
      resetForm();
      loadData(); // Reload appointments
    } catch (err) {
      setError('Failed to book appointment');
      console.error('Error booking appointment:', err);
    }
  };

  const resetForm = () => {
    setSelectedTherapist('');
    setSelectedDate('');
    setSelectedTime('');
    setAppointmentType('');
    setNotes('');
    setError('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTherapistName = (therapistId) => {
    const therapist = therapists.find(t => t.id === therapistId);
    return therapist ? therapist.name : 'Unknown Therapist';
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
          onClick={() => setBookingDialog(true)}
        >
          Book New Session
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
                Upcoming Appointments
              </Typography>
              {appointments.length === 0 ? (
                <Typography variant="body2" color="textSecondary">
                  No appointments scheduled. Book your first therapy session!
                </Typography>
              ) : (
                <List>
                  {appointments.map((appointment) => (
                    <React.Fragment key={appointment.id}>
                      <ListItem>
                        <ListItemText
                          primary={
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                              <Typography variant="subtitle1">
                                {getTherapistName(appointment.therapistId)}
                              </Typography>
                              <Chip
                                label={appointment.status}
                                color={getStatusColor(appointment.status)}
                                size="small"
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2">
                                {appointment.type} - {appointment.date} at {appointment.time}
                              </Typography>
                              {appointment.notes && (
                                <Typography variant="body2" color="textSecondary">
                                  Notes: {appointment.notes}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Booking Dialog */}
      <Dialog open={bookingDialog} onClose={() => setBookingDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Book Therapy Session</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Therapist</InputLabel>
              <Select
                value={selectedTherapist}
                onChange={(e) => setSelectedTherapist(e.target.value)}
                label="Therapist"
              >
                {therapists.map((therapist) => (
                  <MenuItem key={therapist.id} value={therapist.id}>
                    {therapist.name} - {therapist.specialization}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              type="date"
              label="Date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              type="time"
              label="Time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Session Type</InputLabel>
              <Select
                value={appointmentType}
                onChange={(e) => setAppointmentType(e.target.value)}
                label="Session Type"
              >
                <MenuItem value="Initial Consultation">Initial Consultation</MenuItem>
                <MenuItem value="Follow-up">Follow-up Session</MenuItem>
                <MenuItem value="Trauma Therapy">Trauma Therapy</MenuItem>
                <MenuItem value="Anxiety Treatment">Anxiety Treatment</MenuItem>
                <MenuItem value="Depression Treatment">Depression Treatment</MenuItem>
                <MenuItem value="Stress Management">Stress Management</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Notes (Optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              sx={{ mb: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookingDialog(false)}>Cancel</Button>
          <Button onClick={handleBookAppointment} variant="contained">
            Book Appointment
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Appointments; 