import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Context
import { AuthProvider } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/dashboards/StudentDashboard';
import FacultyDashboard from './pages/dashboards/FacultyDashboard';
import ClubAdminDashboard from './pages/dashboards/ClubAdminDashboard';
import CollegeAdminDashboard from './pages/dashboards/CollegeAdminDashboard';
import PendingApproval from './pages/PendingApproval';
import Events from './pages/Events';
import Assignments from './pages/Assignments';
import Certificates from './pages/Certificates';
import VerifyCertificate from './pages/VerifyCertificate';

// Components
import PrivateRoute from './components/PrivateRoute';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/pending" element={<PendingApproval />} />
            <Route path="/verify/certificate/:id" element={<VerifyCertificate />} />
            
            {/* Protected Routes */}
            <Route
              path="/dashboard/student"
              element={
                <PrivateRoute role="student">
                  <StudentDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/faculty"
              element={
                <PrivateRoute role="faculty">
                  <FacultyDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/club-admin"
              element={
                <PrivateRoute role="club_admin">
                  <ClubAdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/college-admin"
              element={
                <PrivateRoute role="college_admin">
                  <CollegeAdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/events"
              element={
                <PrivateRoute>
                  <Events />
                </PrivateRoute>
              }
            />
            <Route
              path="/assignments"
              element={
                <PrivateRoute>
                  <Assignments />
                </PrivateRoute>
              }
            />
            <Route
              path="/certificates"
              element={
                <PrivateRoute>
                  <Certificates />
                </PrivateRoute>
              }
            />
            
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
