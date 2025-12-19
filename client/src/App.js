import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Context
import { AuthProvider } from './context/AuthContext';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import StudentDashboard from './pages/dashboards/StudentDashboard';
import FacultyDashboard from './pages/dashboards/FacultyDashboard';
import ClubAdminDashboard from './pages/dashboards/ClubAdminDashboard';
import CollegeAdminDashboard from './pages/dashboards/CollegeAdminDashboard';
import PendingApproval from './pages/PendingApproval';
import Events from './pages/Events';
import EventRegistration from './pages/EventRegistration';
import Assignments from './pages/Assignments';
import Certificates from './pages/Certificates';
import VerifyCertificate from './pages/VerifyCertificate';
import Badges from './pages/Badges';
import Students from './pages/Students';
import PendingGrades from './pages/PendingGrades';
import CreateAssignment from './pages/CreateAssignment';
import AssignmentDetails from './pages/AssignmentDetails';
import MyClasses from './pages/MyClasses';
import MarkAttendance from './pages/attendance/MarkAttendance';
import ViewAttendance from './pages/attendance/ViewAttendance';

// Components
import PrivateRoute from './components/PrivateRoute';

const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
      light: '#8b9df6',
      dark: '#4c63d2',
      contrastText: '#fff',
    },
    secondary: {
      main: '#764ba2',
      light: '#9b6fc9',
      dark: '#5a3780',
      contrastText: '#fff',
    },
    background: {
      default: 'transparent',
      paper: 'rgba(255, 255, 255, 0.9)',
    },
    info: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '3rem',
      letterSpacing: '-0.02em',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.5rem',
      letterSpacing: '-0.01em',
      color: '#1e293b',
    },
    h3: {
      fontWeight: 700,
      fontSize: '2rem',
      letterSpacing: '-0.01em',
      color: '#334155',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.75rem',
      color: '#475569',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
      color: '#64748b',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
      color: '#64748b',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0 2px 4px rgba(0, 0, 0, 0.05)',
    '0 4px 12px rgba(0, 0, 0, 0.08)',
    '0 8px 24px rgba(0, 0, 0, 0.12)',
    '0 12px 32px rgba(0, 0, 0, 0.14)',
    '0 16px 48px rgba(0, 0, 0, 0.16)',
    '0 20px 56px rgba(0, 0, 0, 0.18)',
    '0 24px 64px rgba(0, 0, 0, 0.20)',
    '0 8px 32px rgba(102, 126, 234, 0.25)',
    '0 12px 40px rgba(102, 126, 234, 0.30)',
    '0 16px 48px rgba(102, 126, 234, 0.35)',
    '0 20px 56px rgba(102, 126, 234, 0.40)',
    '0 2px 4px rgba(0, 0, 0, 0.05)',
    '0 4px 12px rgba(0, 0, 0, 0.08)',
    '0 8px 24px rgba(0, 0, 0, 0.12)',
    '0 12px 32px rgba(0, 0, 0, 0.14)',
    '0 16px 48px rgba(0, 0, 0, 0.16)',
    '0 20px 56px rgba(0, 0, 0, 0.18)',
    '0 24px 64px rgba(0, 0, 0, 0.20)',
    '0 28px 72px rgba(0, 0, 0, 0.22)',
    '0 32px 80px rgba(0, 0, 0, 0.24)',
    '0 36px 88px rgba(0, 0, 0, 0.26)',
    '0 40px 96px rgba(0, 0, 0, 0.28)',
    '0 44px 104px rgba(0, 0, 0, 0.30)',
    '0 48px 112px rgba(0, 0, 0, 0.32)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '&::-webkit-scrollbar': {
            width: '10px',
            height: '10px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
          fontSize: '1rem',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 8px 24px rgba(102, 126, 234, 0.35)',
          '&:hover': {
            background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
            boxShadow: '0 12px 32px rgba(102, 126, 234, 0.45)',
          },
        },
        outlined: {
          borderWidth: 2,
          borderColor: '#667eea',
          color: '#667eea',
          '&:hover': {
            borderWidth: 2,
            borderColor: '#764ba2',
            background: 'rgba(102, 126, 234, 0.05)',
          },
        },
        text: {
          color: '#667eea',
          '&:hover': {
            background: 'rgba(102, 126, 234, 0.08)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        elevation1: {
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
        },
        elevation2: {
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
        },
        elevation3: {
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 16px 48px rgba(102, 126, 234, 0.2)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            background: 'rgba(255, 255, 255, 0.8)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.95)',
            },
            '&.Mui-focused': {
              background: 'rgba(255, 255, 255, 1)',
              boxShadow: '0 4px 16px rgba(102, 126, 234, 0.15)',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          fontSize: '0.875rem',
        },
        filled: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.18)',
          color: '#1e293b',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backdropFilter: 'blur(10px)',
        },
        filledSuccess: {
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        },
        filledError: {
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        },
        filledWarning: {
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        },
        filledInfo: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
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
              path="/events/:eventId/register"
              element={
                <PrivateRoute role="student">
                  <EventRegistration />
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
            <Route
              path="/badges"
              element={
                <PrivateRoute role="student">
                  <Badges />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-classes"
              element={
                <PrivateRoute role="student">
                  <MyClasses />
                </PrivateRoute>
              }
            />
            <Route
              path="/students"
              element={
                <PrivateRoute role="faculty">
                  <Students />
                </PrivateRoute>
              }
            />
            <Route
              path="/pending-grades"
              element={
                <PrivateRoute role="faculty">
                  <PendingGrades />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-assignment"
              element={
                <PrivateRoute role="faculty">
                  <CreateAssignment />
                </PrivateRoute>
              }
            />
            <Route
              path="/assignment/:id"
              element={
                <PrivateRoute role="faculty">
                  <AssignmentDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/mark-attendance"
              element={
                <PrivateRoute role="faculty">
                  <MarkAttendance />
                </PrivateRoute>
              }
            />
            <Route
              path="/attendance"
              element={
                <PrivateRoute role="student">
                  <ViewAttendance />
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
