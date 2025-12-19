import React, { useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/dashboards/StudentDashboard';
import FacultyDashboard from './pages/dashboards/FacultyDashboard';
import CollegeAdminDashboard from './pages/dashboards/CollegeAdminDashboard';
import ClubAdminDashboard from './pages/dashboards/ClubAdminDashboard';
import AttendanceScanner from './pages/attendance/MarkAttendance';
import StudentAttendance from './pages/attendance/ViewAttendance';
import MyClasses from './pages/MyClasses';
import CreateAssignment from './pages/CreateAssignment';
import Assignments from './pages/Assignments';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  const theme = useMemo(() => createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#4f46e5', // Indigo 600
        dark: '#4338ca',
        light: '#6366f1',
      },
      secondary: {
        main: '#7c3aed', // Violet 600
      },
      background: {
        default: '#f8fafc', // Slate 50
        paper: '#ffffff',    // White
      },
      text: {
        primary: '#0f172a', // Slate 900
        secondary: '#475569', // Slate 600
      },
      divider: '#e2e8f0', // Slate 200
    },
    typography: {
      fontFamily: '"Inter", "Outfit", sans-serif',
      h1: { fontWeight: 800, letterSpacing: '-0.025em', color: '#0f172a' },
      h2: { fontWeight: 800, letterSpacing: '-0.02em', color: '#0f172a' },
      h3: { fontWeight: 700, letterSpacing: '-0.01em', color: '#0f172a' },
      h4: { fontWeight: 700, letterSpacing: '-0.01em', color: '#0f172a' },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: '#f8fafc',
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f8fafc',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#e2e8f0',
              borderRadius: '4px',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            padding: '10px 24px',
            borderRadius: '10px',
            transition: 'all 0.2s ease',
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': {
              transform: 'translateY(-1px)',
            },
          },
          containedPrimary: {
            background: '#4f46e5',
            boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)',
            '&:hover': {
              background: '#4338ca',
              boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)',
            },
          },
          outlined: {
            borderColor: '#e2e8f0',
            color: '#475569',
            '&:hover': {
              borderColor: '#cbd5e1',
              backgroundColor: '#f1f5f9',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#ffffff',
              '& fieldset': {
                borderColor: '#e2e8f0',
              },
              '&:hover fieldset': {
                borderColor: '#cbd5e1',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#4f46e5',
              },
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid #e2e8f0',
            boxShadow: 'none',
            color: '#0f172a',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: '#cbd5e1',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
              transform: 'translateY(-2px)',
            },
          },
        },
      },
    },
  }), []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/faculty-dashboard"
              element={
                <ProtectedRoute allowedRoles={['faculty']}>
                  <FacultyDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/college-dashboard"
              element={
                <ProtectedRoute allowedRoles={['college_admin']}>
                  <CollegeAdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/club-dashboard"
              element={
                <ProtectedRoute allowedRoles={['club_admin']}>
                  <ClubAdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/mark-attendance"
              element={
                <ProtectedRoute allowedRoles={['faculty']}>
                  <AttendanceScanner />
                </ProtectedRoute>
              }
            />
            <Route
              path="/attendance"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentAttendance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-classes"
              element={
                <ProtectedRoute>
                  <MyClasses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-assignment"
              element={
                <ProtectedRoute allowedRoles={['faculty']}>
                  <CreateAssignment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assignments"
              element={
                <ProtectedRoute>
                  <Assignments />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
