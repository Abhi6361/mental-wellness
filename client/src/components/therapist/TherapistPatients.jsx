import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
} from '@mui/material';
import { therapistAPI } from '../../services/api';

const TherapistPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientDialog, setPatientDialog] = useState(false);
  const [patientNotes, setPatientNotes] = useState('');

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const response = await therapistAPI.getPatients();
      setPatients(response.data.patients || []);
    } catch (err) {
      setError('Failed to load patients');
      console.error('Error loading patients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setPatientNotes(patient.notes || '');
    setPatientDialog(true);
  };

  const handleSaveNotes = async () => {
    try {
      // In a real app, you'd call an API to save patient notes
      // For now, we'll just update the local state
      setPatients(prev => prev.map(p => 
        p.email === selectedPatient.email 
          ? { ...p, notes: patientNotes }
          : p
      ));
      setPatientDialog(false);
      setSelectedPatient(null);
      setPatientNotes('');
      setError('');
    } catch (err) {
      setError('Failed to save notes');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
      <Typography variant="h4" gutterBottom>
        My Patients
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {patients.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" gutterBottom>
              No Patients Found
            </Typography>
            <Typography variant="body2" color="textSecondary">
              You don't have any patients assigned yet.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Patient List ({patients.length} patients)
                </Typography>
                <List>
                  {patients.map((patient, index) => (
                    <React.Fragment key={patient.email}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {patient.name.charAt(0).toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <>
                              <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="subtitle1">
                                  {patient.name}
                                </Typography>
                                <Box display="flex" alignItems="center" gap={1}>
                                  <Chip
                                    label={`${patient.totalAppointments} sessions`}
                                    size="small"
                                    color="info"
                                  />
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => handleViewPatient(patient)}
                                  >
                                    View Details
                                  </Button>
                                </Box>
                              </Box>
                            </>
                          }
                          secondary={
                            <>
                              <Typography variant="body2">
                                📧 {patient.email}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                📅 Last session: {formatDate(patient.lastAppointment)}
                              </Typography>
                              {patient.notes && (
                                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                  📝 {patient.notes.substring(0, 100)}...
                                </Typography>
                              )}
                            </>
                          }
                        />
                      </ListItem>
                      {index < patients.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Patient Details Dialog */}
      <Dialog open={patientDialog} onClose={() => setPatientDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Patient Details - {selectedPatient?.name}
        </DialogTitle>
        <DialogContent>
          {selectedPatient && (
            <Box sx={{ pt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Name
                    </Typography>
                    <Typography variant="body1">
                      {selectedPatient.name}
                    </Typography>
                  </Paper>
                  
                  <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Email
                    </Typography>
                    <Typography variant="body1">
                      {selectedPatient.email}
                    </Typography>
                  </Paper>
                  
                  <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Total Sessions
                    </Typography>
                    <Typography variant="body1">
                      {selectedPatient.totalAppointments} sessions
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Last Session
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(selectedPatient.lastAppointment)}
                    </Typography>
                  </Paper>
                  
                  <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Status
                    </Typography>
                    <Chip 
                      label={selectedPatient.totalAppointments > 0 ? "Active Patient" : "New Patient"} 
                      color={selectedPatient.totalAppointments > 0 ? "success" : "warning"}
                      size="small"
                    />
                  </Paper>
                </Grid>
              </Grid>
              
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Patient Notes"
                value={patientNotes}
                onChange={(e) => setPatientNotes(e.target.value)}
                placeholder="Add notes about this patient..."
                sx={{ mt: 2 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPatientDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveNotes} variant="contained">
            Save Notes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TherapistPatients; 