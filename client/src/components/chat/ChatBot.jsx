import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Divider,
} from '@mui/material';
import { chatAPI } from '../../services/api';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI wellness assistant powered by Groq. How are you feeling today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      // Use real API call to Groq
      const response = await chatAPI.sendMessage({ message: inputMessage });
      const botResponse = {
        id: Date.now() + 1,
        text: response.data.message,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Fallback response if API fails
      const fallbackResponse = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          AI Wellness Assistant
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" gutterBottom>
          Powered by Groq AI
        </Typography>
        
        <Paper elevation={3} sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
          {/* Messages Area */}
          <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
            <List>
              {messages.map((message) => (
                <ListItem
                  key={message.id}
                  sx={{
                    justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                    mb: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      maxWidth: '70%',
                      flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: message.sender === 'user' ? 'primary.main' : 'secondary.main',
                        mr: message.sender === 'user' ? 0 : 1,
                        ml: message.sender === 'user' ? 1 : 0,
                      }}
                    >
                      {message.sender === 'user' ? 'U' : 'AI'}
                    </Avatar>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        bgcolor: message.sender === 'user' ? 'primary.light' : 'grey.100',
                        color: message.sender === 'user' ? 'white' : 'text.primary',
                      }}
                    >
                      <Typography variant="body1">{message.text}</Typography>
                      <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        {message.timestamp.toLocaleTimeString()}
                      </Typography>
                    </Paper>
                  </Box>
                </ListItem>
              ))}
              {loading && (
                <ListItem sx={{ justifyContent: 'flex-start' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Avatar sx={{ bgcolor: 'secondary.main', mr: 1 }}>
                      AI
                    </Avatar>
                    <Paper elevation={1} sx={{ p: 2, bgcolor: 'grey.100' }}>
                      <Typography variant="body1">Thinking...</Typography>
                    </Paper>
                  </Box>
                </ListItem>
              )}
            </List>
            <div ref={messagesEndRef} />
          </Box>
          
          <Divider />
          
          {/* Input Area */}
          <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={loading}
            />
            <Button
              variant="contained"
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || loading}
            >
              📤
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ChatBot; 