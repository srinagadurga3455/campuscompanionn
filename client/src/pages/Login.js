import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SchoolIcon from '@mui/icons-material/School';
import Navbar from '../components/Navbar';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);
    if (result.success) {
      // Redirect based on role
      const role = result.user.role;
      if (role === 'student') navigate('/dashboard');
      else if (role === 'faculty') navigate('/faculty-dashboard');
      else if (role === 'college_admin') navigate('/college-dashboard');
      else if (role === 'club_admin') navigate('/club-dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', position: 'relative', overflow: 'hidden' }}>
      <Navbar />

      <Container maxWidth="sm" sx={{ py: { xs: 8, md: 12 }, position: 'relative', zIndex: 1 }}>
        <Paper
          className="saas-card"
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '16px',
            animation: 'fadeIn 0.5s ease-out'
          }}
        >
          <Box sx={{ mb: 5, textAlign: 'center' }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '12px',
                bgcolor: 'rgba(79, 70, 229, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2.5
              }}
            >
              <SchoolIcon sx={{ color: 'primary.main', fontSize: 24 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-0.02em', color: 'text.primary' }}>
              Welcome Back
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Institutional access to Campus Companion portal
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 4, borderRadius: '10px' }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Academic Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Security Key"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                required
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.8,
                  fontSize: '1rem',
                  fontWeight: 700,
                  boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)'
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Authorize Access'}
              </Button>
            </Stack>
          </Box>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              New to the platform?{' '}
              <RouterLink to="/register" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: 700 }}>
                Apply for Registration
              </RouterLink>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
