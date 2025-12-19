import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Button,
} from '@mui/material';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import api from '../utils/api';

const PendingApproval = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkApprovalStatus();
    const interval = setInterval(checkApprovalStatus, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const checkApprovalStatus = async () => {
    try {
      const response = await api.get('/auth/status');
      setStatus(response.data.approvalStatus);
      
      if (response.data.approvalStatus === 'approved') {
        setTimeout(() => {
          // Navigate based on user role
          const dashboardRoutes = {
            student: '/dashboard/student',
            faculty: '/dashboard/faculty',
            club_admin: '/dashboard/club-admin',
            college_admin: '/dashboard/college-admin',
          };
          navigate(dashboardRoutes[user?.role] || '/dashboard/student');
        }, 2000);
      }
    } catch (error) {
      console.error('Error checking status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%', textAlign: 'center' }}>
          {status === 'pending' && (
            <>
              <HourglassEmptyIcon sx={{ fontSize: 80, color: 'warning.main', mb: 2 }} />
              <Typography variant="h4" gutterBottom>
                Approval Pending
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Your {user?.role === 'faculty' ? 'faculty' : user?.role === 'club_admin' ? 'club admin' : ''} registration is awaiting admin approval. 
                You will receive a WhatsApp notification once approved.
              </Typography>
              {user?.role === 'student' && (
                <Typography variant="body2" color="text.secondary" paragraph>
                  Once approved, you will receive your unique Blockchain Student ID.
                </Typography>
              )}
              {user?.role === 'faculty' && (
                <Typography variant="body2" color="text.secondary" paragraph>
                  Once approved, you will receive your unique Teacher Code for class management.
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary" paragraph>
                This page will automatically update once your account is approved.
              </Typography>
              <CircularProgress sx={{ mt: 2 }} />
            </>
          )}

          {status === 'approved' && (
            <>
              <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
              <Typography variant="h4" gutterBottom>
                Approved!
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Your account has been approved. Redirecting to dashboard...
              </Typography>
              {user?.blockchainId && (
                <Typography variant="body2" sx={{ fontFamily: 'monospace', mt: 2, fontWeight: 'bold' }}>
                  Your Student ID: {user.blockchainId}
                </Typography>
              )}
              {user?.teacherCode && (
                <Typography variant="body2" sx={{ fontFamily: 'monospace', mt: 2, fontWeight: 'bold' }}>
                  Your Teacher Code: {user.teacherCode}
                </Typography>
              )}
            </>
          )}

          {status === 'rejected' && (
            <>
              <CancelIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
              <Typography variant="h4" gutterBottom>
                Registration Rejected
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Unfortunately, your registration has been rejected. Please contact the administration for more information.
              </Typography>
              <Button variant="contained" onClick={handleLogout} sx={{ mt: 2 }}>
                Back to Login
              </Button>
            </>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default PendingApproval;
