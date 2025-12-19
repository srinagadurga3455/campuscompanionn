import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  IconButton,
  Alert,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../utils/api';

const MyClasses = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [teacherCode, setTeacherCode] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const response = await api.get('/enrollments/my-classes');
      setEnrollments(response.data.enrollments || []);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    }
  };

  const handleJoinClass = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/enrollments/join', {
        teacherCode,
        subject,
      });

      setSuccess(response.data.message);
      setTeacherCode('');
      setSubject('');
      await fetchEnrollments();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to join class');
    } finally {
      setLoading(false);
    }
  };

  const handleDropClass = async (enrollmentId) => {
    if (!window.confirm('Are you sure you want to drop this class?')) return;

    try {
      await api.delete(`/enrollments/${enrollmentId}`);
      setSuccess('Class dropped successfully');
      await fetchEnrollments();
    } catch (error) {
      setError('Failed to drop class');
    }
  };

  return (
    <>
      <Navbar title="My Classes" />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Join Class Form */}
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Avatar
                  sx={{
                    width: 50,
                    height: 50,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  }}
                >
                  <PersonAddIcon />
                </Avatar>
                <Typography variant="h5">Join a Class</Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
                  {success}
                </Alert>
              )}

              <form onSubmit={handleJoinClass}>
                <TextField
                  fullWidth
                  label="Teacher Code"
                  value={teacherCode}
                  onChange={(e) => setTeacherCode(e.target.value.toUpperCase())}
                  placeholder="e.g., TC24CS001"
                  required
                  sx={{ mb: 2 }}
                  helperText="Enter the teacher code provided by your instructor"
                />

                <TextField
                  fullWidth
                  label="Subject Name"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Data Structures"
                  required
                  sx={{ mb: 2 }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  startIcon={<PersonAddIcon />}
                >
                  {loading ? 'Joining...' : 'Join Class'}
                </Button>
              </form>
            </Paper>
          </Grid>

          {/* Enrolled Classes */}
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Avatar
                  sx={{
                    width: 50,
                    height: 50,
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  }}
                >
                  <SchoolIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5">Enrolled Classes</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {enrollments.length} classes
                  </Typography>
                </Box>
              </Box>

              {enrollments.length === 0 ? (
                <Box textAlign="center" py={4}>
                  <SchoolIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    You haven't enrolled in any classes yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Use the form on the left to join a class
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {enrollments.map((enrollment) => (
                    <Grid item xs={12} key={enrollment._id}>
                      <Card>
                        <CardContent>
                          <Box display="flex" justifyContent="space-between" alignItems="start">
                            <Box flex={1}>
                              <Typography variant="h6" gutterBottom>
                                {enrollment.subject}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                👨‍🏫 {enrollment.faculty?.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                📧 {enrollment.faculty?.email}
                              </Typography>
                              <Box display="flex" gap={1} mt={1}>
                                <Chip
                                  label={enrollment.teacherCode}
                                  size="small"
                                  color="primary"
                                />
                                <Chip
                                  label={`Section ${enrollment.classSection}`}
                                  size="small"
                                />
                                <Chip
                                  label={new Date(enrollment.enrolledAt).toLocaleDateString()}
                                  size="small"
                                  variant="outlined"
                                />
                              </Box>
                            </Box>
                            <IconButton
                              color="error"
                              onClick={() => handleDropClass(enrollment._id)}
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default MyClasses;
