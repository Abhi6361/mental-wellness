import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';

// Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/Dashboard';
import Appointments from './components/user/Appointments';
import MyAppointments from './components/user/MyAppointments';
import Profile from './components/Profile';
import ChatBot from './components/chat/ChatBot';
import PlaceholderPage from './components/PlaceholderPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import TherapistAppointments from './components/therapist/TherapistAppointments';
import TherapistPatients from './components/therapist/TherapistPatients';
import TherapistAvailability from './components/therapist/TherapistAvailability';
import AdminUsers from './components/admin/AdminUsers';
import AdminTherapists from './components/admin/AdminTherapists';
import AdminAnalytics from './components/admin/AdminAnalytics';
import SystemSettings from './components/admin/SystemSettings';
import OnlineMeeting from './components/meeting/OnlineMeeting';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

// Animated Routes Component
const AnimatedRoutes = () => {
  const location = useLocation();

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.98
    },
    in: {
      opacity: 1,
      y: 0,
      scale: 1
    },
    out: {
      opacity: 0,
      y: -20,
      scale: 0.98
    }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.4
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Login />
            </motion.div>
          } 
        />
        <Route 
          path="/register" 
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Register />
            </motion.div>
          } 
        />
        
        {/* Protected Routes - Unified Dashboard */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Dashboard />
              </motion.div>
            </ProtectedRoute>
          } 
        />
        
        {/* Feature Routes */}
        <Route 
          path="/appointments" 
          element={
            <ProtectedRoute>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Appointments />
              </motion.div>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Profile />
              </motion.div>
            </ProtectedRoute>
          } 
        />
        
        {/* User-specific routes */}
        <Route 
          path="/my-appointments" 
          element={
            <ProtectedRoute>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <MyAppointments />
              </motion.div>
            </ProtectedRoute>
          } 
        />
        
        {/* Therapist-specific routes */}
        <Route 
          path="/patients" 
          element={
            <ProtectedRoute>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <TherapistPatients />
              </motion.div>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/therapist-appointments" 
          element={
            <ProtectedRoute>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <TherapistAppointments />
              </motion.div>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/availability" 
          element={
            <ProtectedRoute>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <TherapistAvailability />
              </motion.div>
            </ProtectedRoute>
          } 
        />
        
        {/* Admin-specific routes */}
        <Route 
          path="/users" 
          element={
            <ProtectedRoute>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <AdminUsers />
              </motion.div>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/therapists" 
          element={
            <ProtectedRoute>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <AdminTherapists />
              </motion.div>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/analytics" 
          element={
            <ProtectedRoute>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <AdminAnalytics />
              </motion.div>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <SystemSettings />
              </motion.div>
            </ProtectedRoute>
          } 
        />
        
        {/* Chat Route */}
        <Route 
          path="/chat" 
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <ChatBot />
            </motion.div>
          } 
        />
        
        {/* Meeting Route */}
        <Route
          path="/meeting/:appointmentId"
          element={
            <ProtectedRoute>
              <OnlineMeeting />
            </ProtectedRoute>
          }
        />
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/user/*" element={<Navigate to="/dashboard" replace />} />
        <Route path="/therapist/*" element={<Navigate to="/dashboard" replace />} />
        <Route path="/admin/*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ minHeight: '100vh' }}>
          <AnimatedRoutes />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
