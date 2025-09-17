import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PlaceholderPage = ({ title, description, icon }) => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box textAlign="center">
        <Typography variant="h1" sx={{ fontSize: '4rem', mb: 2 }}>
          {icon}
        </Typography>
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
          {description}
        </Typography>
        
        <Card sx={{ maxWidth: 600, mx: 'auto', mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Coming Soon!
            </Typography>
            <Typography variant="body2" color="textSecondary">
              This feature is currently under development. We're working hard to bring you the best experience possible.
            </Typography>
          </CardContent>
        </Card>
        
        <Button
          variant="contained"
          onClick={() => navigate('/dashboard')}
          sx={{ mr: 2 }}
        >
          Back to Dashboard
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate('/chat')}
        >
          Chat with AI
        </Button>
      </Box>
    </Container>
  );
};

export default PlaceholderPage; 