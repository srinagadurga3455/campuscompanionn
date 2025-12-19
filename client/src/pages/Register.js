import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  InputAdornment,
  Divider,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SchoolIcon from '@mui/icons-material/School';
import VerifiedIcon from '@mui/icons-material/Verified';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import Navbar from '../components/Navbar';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const branches = [
  { code: 'CSE', name: 'Computer Science and Engineering' },
  { code: 'AIML', name: 'Artificial Intelligence and Machine Learning' },
  { code: 'CIC', name: 'Computer and Information Communication' },
  { code: 'AIDS', name: 'Artificial Intelligence and Data Science' },
  { code: 'IT', name: 'Information Technology' },
  { code: 'CSBS', name: 'Computer Science and Business Systems' },
  { code: 'ECE', name: 'Electronics and Communication Engineering' },
  { code: 'EEE', name: 'Electrical and Electronics Engineering' },
  { code: 'MECH', name: 'Mechanical Engineering' },
  { code: 'CIVIL', name: 'Civil Engineering' },
  { code: 'CSD', name: 'Computer Science and Design' },
  { code: 'CSIT', name: 'Computer Science and Information Technology' }
];

const steps = ['Identity Info', 'Verify Email'];

const Register = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'student',
    year: '',
    yearOfAdmission: '',
    classSection: '',
    branch: '',
  });
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/send-otp`, formData);
      if (response.data.success) {
        setSuccess('OTP sent to your email! Please check your inbox.');
        setActiveStep(1);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (otp.length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/verify-otp`, {
        ...formData,
        otp,
      });

      if (response.data.success) {
        setSuccess(response.data.message);
        setTimeout(() => navigate('/login'), 2500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/send-otp`, formData);
      if (response.data.success) {
        setSuccess('New OTP sent to your email!');
        setOtp('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />

      <Container maxWidth="md" sx={{ py: { xs: 8, md: 10 } }}>
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
          <Box sx={{ mb: 6, textAlign: 'center' }}>
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
              <VerifiedIcon sx={{ color: 'primary.main', fontSize: 24 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-0.02em' }}>
              Join the Ecosystem
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Create your blockchain-verified institutional account
            </Typography>
          </Box>

          <Stepper activeStep={activeStep} sx={{ mb: 8, '& .MuiStepIcon-root.Mui-active': { color: 'primary.main' }, '& .MuiStepIcon-root.Mui-completed': { color: 'primary.main' } }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 4, borderRadius: '10px' }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 4, borderRadius: '10px' }}>
              {success}
            </Alert>
          )}

          {activeStep === 0 && (
            <Box component="form" onSubmit={handleSendOTP} sx={{ animation: 'fadeIn 0.4s' }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  helperText="At least 6 characters"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  helperText="10 digit mobile number"
                  inputProps={{ maxLength: 10, pattern: "[0-9]*" }}
                />
                <TextField
                  fullWidth
                  select
                  label="Role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="student">Student</MenuItem>
                  <MenuItem value="faculty">Faculty</MenuItem>
                  <MenuItem value="club_admin">Club Admin</MenuItem>
                </TextField>

                {(formData.role === 'student' || formData.role === 'faculty') && (
                  <TextField
                    fullWidth
                    select
                    label="Branch"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    required
                  >
                    {branches.map((branch) => (
                      <MenuItem key={branch.code} value={branch.name}>
                        {branch.name} ({branch.code})
                      </MenuItem>
                    ))}
                  </TextField>
                )}

                {formData.role === 'student' && (
                  <>
                    <TextField
                      fullWidth
                      label="Year"
                      name="year"
                      type="number"
                      value={formData.year}
                      onChange={handleChange}
                      required
                      inputProps={{ min: 1, max: 4 }}
                    />
                    <TextField
                      fullWidth
                      label="Year of Admission"
                      name="yearOfAdmission"
                      type="number"
                      value={formData.yearOfAdmission}
                      onChange={handleChange}
                      required
                      helperText="Admission Year (e.g., 2023)"
                    />
                    <TextField
                      fullWidth
                      label="Class Section"
                      name="classSection"
                      value={formData.classSection}
                      onChange={handleChange}
                      helperText="Optional (e.g., A, B)"
                    />
                  </>
                )}
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  mt: 6,
                  py: 1.5,
                  fontWeight: 800,
                  fontSize: '1rem',
                  boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.1), 0 2px 4px -1px rgba(79, 70, 229, 0.06)'
                }}
                disabled={loading}
                startIcon={loading ? null : <MailOutlineIcon />}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Verification OTP'}
              </Button>
            </Box>
          )}

          {activeStep === 1 && (
            <Box sx={{ animation: 'fadeIn 0.4s' }}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <VerifiedUserIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Verify Your Email
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  A 6-digit OTP was sent to <strong>{formData.email}</strong>
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleVerifyOTP}>
                <TextField
                  fullWidth
                  label="OTP code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  inputProps={{
                    maxLength: 6,
                    style: { fontSize: 24, letterSpacing: 8, textAlign: 'center' }
                  }}
                  helperText="Check your inbox (and spam)"
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{ mt: 4, py: 1.5, fontWeight: 800 }}
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify & Finalize'}
                </Button>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                  <Button
                    onClick={() => setActiveStep(0)}
                    disabled={loading}
                    variant="text"
                    sx={{ color: 'text.secondary', fontWeight: 600 }}
                  >
                    ← Back to Details
                  </Button>
                  <Button
                    onClick={handleResendOTP}
                    disabled={loading}
                    variant="text"
                    sx={{ color: 'primary.main', fontWeight: 600 }}
                  >
                    Resend Code
                  </Button>
                </Box>
              </Box>
            </Box>
          )}

          <Divider sx={{ my: 4 }} />

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Already registered?{' '}
              <RouterLink to="/login" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: 700 }}>
                Sign In to Portal
              </RouterLink>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
