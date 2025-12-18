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
      main: '#1e3a5f', // Dark navy blue
      light: '#2c5282', // Medium blue
      dark: '#0f2744', // Darker navy
      contrastText: '#fff',
    },
    secondary: {
      main: '#2d6a7d', // Teal
      light: '#3d8ba3',
      dark: '#1e4a5a',
      contrastText: '#fff',
    },
    background: {
      default: '#f5f5f5', // Light gray
      paper: '#ffffff',
    },
    info: {
      main: '#2c5282', // Medium blue
    },
    success: {
      main: '#2d6a7d', // Teal
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
      color: '#1e3a5f',
    },
    h2: {
      fontWeight: 600,
      color: '#1e3a5f',
    },
    h3: {
      fontWeight: 600,
      color: '#1e3a5f',
    },
    h4: {
      fontWeight: 600,
      color: '#2c5282',
    },
    h5: {
      fontWeight: 500,
      color: '#2c5282',
    },
    h6: {
      fontWeight: 500,
      color: '#2d6a7d',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
        contained: {
          boxShadow: '0 4px 12px rgba(30, 58, 95, 0.15)',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(30, 58, 95, 0.25)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(30, 58, 95, 0.08)',
        },
        elevation3: {
          boxShadow: '0 4px 16px rgba(30, 58, 95, 0.12)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(30, 58, 95, 0.08)',
        },
      },
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
