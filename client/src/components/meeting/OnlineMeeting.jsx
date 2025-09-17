import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  IconButton,
  Paper,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  AppBar,
  Toolbar,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { authAPI } from '../../services/api';

const OnlineMeeting = () => {
  const navigate = useNavigate();
  const { appointmentId } = useParams();
  const [user, setUser] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sessionTime, setSessionTime] = useState(0);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [showVideoNotification, setShowVideoNotification] = useState(false);
  
  const videoRef = useRef(null);
  const localVideoRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    
    // Load appointment data
    loadAppointment(userData);
    
    // Start session timer
    intervalRef.current = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const loadAppointment = (userData) => {
    try {
      // Mock appointment data - in real app, fetch from API
      const mockAppointment = {
        id: appointmentId || '1',
        therapistName: 'Dr. Sarah Johnson',
        patientName: userData?.name || 'Test User',
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        status: 'in-progress',
        duration: 60, // minutes
      };
      setAppointment(mockAppointment);
      
      // Mock participants
      setParticipants([
        { id: 1, name: 'Dr. Sarah Johnson', role: 'therapist', isOnline: true },
        { id: 2, name: userData?.name || 'Test User', role: 'patient', isOnline: true },
      ]);
    } catch (error) {
      console.error('Error loading appointment:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    // In real app, toggle video stream
  };

  const handleToggleAudio = () => {
    setIsAudioOn(!isAudioOn);
    // In real app, toggle audio stream
  };

  const handleToggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    // In real app, toggle screen sharing
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        sender: user?.name || 'User',
        text: newMessage,
        timestamp: new Date().toLocaleTimeString(),
        isOwn: true,
      };
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const handleEndSession = () => {
    setShowEndDialog(true);
  };

  const confirmEndSession = () => {
    setIsConnected(false);
    setShowEndDialog(false);
    // In real app, end the meeting and save session data
    navigate('/dashboard');
  };

  const handleJoinMeeting = () => {
    setIsConnected(true);
    // Automatically enable video and audio when joining
    setIsVideoOn(true);
    setIsAudioOn(true);
    // Show notification
    setShowVideoNotification(true);
    // Hide notification after 3 seconds
    setTimeout(() => setShowVideoNotification(false), 3000);
    // In real app, connect to video/audio streams
    console.log('Joining meeting with video and audio enabled');
  };

  const handleLeaveMeeting = () => {
    setIsConnected(false);
    navigate('/dashboard');
  };

  if (!appointment) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography>Loading meeting...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Meeting Header */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Online Therapy Session
          </Typography>
          {isConnected && isVideoOn && (
            <Chip 
              label="🎥 Video Active" 
              color="success" 
              size="small"
              sx={{ mr: 2, backgroundColor: '#4caf50' }}
            />
          )}
          <Chip 
            label={`Session Time: ${formatTime(sessionTime)}`} 
            color="secondary" 
            sx={{ mr: 2 }}
          />
          <Typography variant="body2" sx={{ mr: 2 }}>
            {appointment.therapistName} & {appointment.patientName}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 2, height: 'calc(100vh - 120px)' }}>
        {/* Video/Audio Auto-Enable Notification */}
        {showVideoNotification && (
          <Alert 
            severity="success" 
            sx={{ mb: 2 }}
            onClose={() => setShowVideoNotification(false)}
          >
            🎥 Video and 🎤 Audio automatically enabled for your therapy session
          </Alert>
        )}
        
        <Grid container spacing={2} sx={{ height: '100%' }}>
          {/* Main Video Area */}
          <Grid item xs={12} md={8}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ height: '100%', p: 0 }}>
                <Box sx={{ 
                  height: '100%', 
                  backgroundColor: '#000', 
                  display: 'flex', 
                  flexDirection: 'column',
                  position: 'relative'
                }}>
                  {/* Main Video Display */}
                  <Box sx={{ 
                    flex: 1, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    position: 'relative'
                  }}>
                    {isConnected ? (
                      <Box sx={{ 
                        width: '100%', 
                        height: '100%', 
                        backgroundColor: isVideoOn ? '#1a1a1a' : '#333',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        {isVideoOn ? (
                          <Box sx={{ 
                            width: '100%', 
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative'
                          }}>
                            {/* Simulated Video Stream */}
                            <Box sx={{
                              width: '80%',
                              height: '80%',
                              backgroundColor: '#2a2a2a',
                              borderRadius: 2,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: '2px solid #444',
                              position: 'relative',
                              overflow: 'hidden'
                            }}>
                              {/* Video Content Simulation */}
                              <Box sx={{
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(45deg, #3f51b5, #2196f3, #00bcd4)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative'
                              }}>
                                <Typography variant="h4" color="white" sx={{ fontWeight: 'bold' }}>
                                  🎥 Live Video Stream
                                </Typography>
                                
                                {/* Video Status Indicators */}
                                <Box sx={{
                                  position: 'absolute',
                                  top: 10,
                                  left: 10,
                                  display: 'flex',
                                  gap: 1
                                }}>
                                  <Chip 
                                    label="LIVE" 
                                    color="error" 
                                    size="small"
                                    sx={{ backgroundColor: '#f44336' }}
                                  />
                                  <Chip 
                                    label="HD" 
                                    color="primary" 
                                    size="small"
                                    sx={{ backgroundColor: '#2196f3' }}
                                  />
                                </Box>
                                
                                {/* Connection Quality */}
                                <Box sx={{
                                  position: 'absolute',
                                  top: 10,
                                  right: 10,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1
                                }}>
                                  <Typography variant="body2" color="white">
                                    📶 Excellent
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                            
                            {/* Video Controls Overlay */}
                            <Box sx={{
                              position: 'absolute',
                              bottom: 20,
                              left: '50%',
                              transform: 'translateX(-50%)',
                              display: 'flex',
                              gap: 2,
                              backgroundColor: 'rgba(0,0,0,0.7)',
                              padding: 2,
                              borderRadius: 3
                            }}>
                              <IconButton 
                                onClick={handleToggleAudio}
                                sx={{ 
                                  backgroundColor: isAudioOn ? 'success.main' : 'error.main',
                                  color: 'white',
                                  '&:hover': { backgroundColor: isAudioOn ? 'success.dark' : 'error.dark' }
                                }}
                              >
                                {isAudioOn ? '🎤' : '🔇'}
                              </IconButton>
                              
                              <IconButton 
                                onClick={handleToggleVideo}
                                sx={{ 
                                  backgroundColor: isVideoOn ? 'success.main' : 'error.main',
                                  color: 'white',
                                  '&:hover': { backgroundColor: isVideoOn ? 'success.dark' : 'error.dark' }
                                }}
                              >
                                {isVideoOn ? '📹' : '🚫'}
                              </IconButton>
                              
                              <IconButton 
                                onClick={handleToggleScreenShare}
                                sx={{ 
                                  backgroundColor: isScreenSharing ? 'warning.main' : 'grey.600',
                                  color: 'white',
                                  '&:hover': { backgroundColor: isScreenSharing ? 'warning.dark' : 'grey.700' }
                                }}
                              >
                                🖥️
                              </IconButton>
                            </Box>
                          </Box>
                        ) : (
                          <Typography variant="h6" color="white">
                            Video is currently turned off
                          </Typography>
                        )}
                      </Box>
                    ) : (
                      <Box sx={{ textAlign: 'center', color: 'white' }}>
                        <Typography variant="h5" gutterBottom>
                          Session Not Started
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 3 }}>
                          Click "Join Meeting" to begin your therapy session
                        </Typography>
                        <Button 
                          variant="contained" 
                          size="large" 
                          onClick={handleJoinMeeting}
                          sx={{ mr: 2 }}
                        >
                          🎥 Join Meeting
                        </Button>
                        <Button 
                          variant="outlined" 
                          size="large" 
                          onClick={() => navigate('/dashboard')}
                          sx={{ color: 'white', borderColor: 'white' }}
                        >
                          ❌ Leave
                        </Button>
                      </Box>
                    )}
                  </Box>

                  {/* Local Video (Picture-in-Picture) */}
                  {isConnected && (
                    <Box sx={{ 
                      position: 'absolute', 
                      top: 20, 
                      right: 20, 
                      width: 200, 
                      height: 150,
                      backgroundColor: isVideoOn ? '#2a2a2a' : '#555',
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid white',
                      overflow: 'hidden'
                    }}>
                      {isVideoOn ? (
                        <Box sx={{
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative'
                        }}>
                          <Typography variant="body2" color="white" sx={{ fontWeight: 'bold' }}>
                            👤 You
                          </Typography>
                          
                          {/* Local Video Status */}
                          <Box sx={{
                            position: 'absolute',
                            top: 5,
                            left: 5,
                            display: 'flex',
                            gap: 0.5
                          }}>
                            <Chip 
                              label="LIVE" 
                              color="error" 
                              size="small"
                              sx={{ 
                                backgroundColor: '#f44336',
                                fontSize: '0.6rem',
                                height: 20
                              }}
                            />
                          </Box>
                          
                          {/* Audio Indicator */}
                          <Box sx={{
                            position: 'absolute',
                            top: 5,
                            right: 5
                          }}>
                            <Typography variant="caption" color="white">
                              {isAudioOn ? '🎤' : '🔇'}
                            </Typography>
                          </Box>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="white">
                          Video Off
                        </Typography>
                      )}
                    </Box>
                  )}

                  {/* Meeting Controls */}
                  {isConnected && (
                    <Box sx={{ 
                      position: 'absolute', 
                      bottom: 20, 
                      left: '50%', 
                      transform: 'translateX(-50%)',
                      display: 'flex',
                      gap: 2,
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      padding: 2,
                      borderRadius: 3
                    }}>
                      <IconButton 
                        onClick={handleToggleAudio}
                        sx={{ 
                          backgroundColor: isAudioOn ? 'success.main' : 'error.main',
                          color: 'white',
                          '&:hover': { backgroundColor: isAudioOn ? 'success.dark' : 'error.dark' }
                        }}
                      >
                        {isAudioOn ? '🎤' : '🔇'}
                      </IconButton>
                      
                      <IconButton 
                        onClick={handleToggleVideo}
                        sx={{ 
                          backgroundColor: isVideoOn ? 'success.main' : 'error.main',
                          color: 'white',
                          '&:hover': { backgroundColor: isVideoOn ? 'success.dark' : 'error.dark' }
                        }}
                      >
                        {isVideoOn ? '📹' : '🚫'}
                      </IconButton>
                      
                      <IconButton 
                        onClick={handleToggleScreenShare}
                        sx={{ 
                          backgroundColor: isScreenSharing ? 'warning.main' : 'grey.600',
                          color: 'white',
                          '&:hover': { backgroundColor: isScreenSharing ? 'warning.dark' : 'grey.700' }
                        }}
                      >
                        🖥️
                      </IconButton>
                      
                      <Button 
                        variant="contained" 
                        color="error" 
                        onClick={handleEndSession}
                        sx={{ ml: 2 }}
                      >
                        End Session
                      </Button>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Grid container spacing={2} sx={{ height: '100%' }}>
              {/* Participants */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Participants ({participants.length})
                    </Typography>
                    <List dense>
                      {participants.map((participant) => (
                        <ListItem key={participant.id}>
                          <ListItemText 
                            primary={participant.name}
                            secondary={participant.role}
                          />
                          <Chip 
                            label={participant.isOnline ? 'Online' : 'Offline'}
                            color={participant.isOnline ? 'success' : 'error'}
                            size="small"
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              {/* Chat */}
              <Grid item xs={12} sx={{ flex: 1 }}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" gutterBottom>
                      Chat
                    </Typography>
                    
                    {/* Chat Messages */}
                    <Box sx={{ 
                      flex: 1, 
                      overflowY: 'auto', 
                      mb: 2,
                      maxHeight: 300
                    }}>
                      {chatMessages.length === 0 ? (
                        <Typography variant="body2" color="textSecondary" align="center">
                          No messages yet. Start the conversation!
                        </Typography>
                      ) : (
                        chatMessages.map((message) => (
                          <Box 
                            key={message.id} 
                            sx={{ 
                              mb: 1,
                              textAlign: message.isOwn ? 'right' : 'left'
                            }}
                          >
                            <Paper 
                              sx={{ 
                                p: 1, 
                                display: 'inline-block',
                                maxWidth: '80%',
                                backgroundColor: message.isOwn ? 'primary.main' : 'grey.100',
                                color: message.isOwn ? 'white' : 'text.primary'
                              }}
                            >
                              <Typography variant="body2">
                                {message.text}
                              </Typography>
                              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                {message.timestamp}
                              </Typography>
                            </Paper>
                          </Box>
                        ))
                      )}
                    </Box>
                    
                    {/* Message Input */}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        disabled={!isConnected}
                      />
                      <Button 
                        variant="contained" 
                        onClick={handleSendMessage}
                        disabled={!isConnected || !newMessage.trim()}
                      >
                        Send
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>

      {/* End Session Dialog */}
      <Dialog open={showEndDialog} onClose={() => setShowEndDialog(false)}>
        <DialogTitle>End Session</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to end this therapy session? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEndDialog(false)}>Cancel</Button>
          <Button onClick={confirmEndSession} color="error" variant="contained">
            End Session
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OnlineMeeting; 