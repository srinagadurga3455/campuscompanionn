import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const PrivateRoute = ({ children, role }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.approvalStatus === 'pending') {
    return <Navigate to="/pending" replace />;
  }

  if (user?.approvalStatus === 'rejected') {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    // Redirect to appropriate dashboard based on user role
    const dashboardMap = {
      student: '/dashboard/student',
      faculty: '/dashboard/faculty',
      club_admin: '/dashboard/club-admin',
      college_admin: '/dashboard/college-admin',
    };
    return <Navigate to={dashboardMap[user.role] || '/login'} replace />;
  }

  return children;
};

export default PrivateRoute;
