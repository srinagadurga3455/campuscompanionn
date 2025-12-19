import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import BadgeIcon from '@mui/icons-material/Badge';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import api from '../../utils/api';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    eventsRegistered: 0,
    assignmentsPending: 0,
    certificates: 0,
    badges: 0,
    attendancePercentage: 0,
  });
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recentAssignments, setRecentAssignments] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch events (automatically filtered by department on backend)
      const eventsRes = await api.get('/events?upcoming=true');
      const myEvents = eventsRes.data.events || [];
      setUpcomingEvents(myEvents.slice(0, 3));

      // Fetch assignments (filtered by department and year)
      const assignmentsRes = await api.get('/assignments');
      const myAssignments = assignmentsRes.data.assignments || [];
      setRecentAssignments(myAssignments.slice(0, 3));

      // Count pending assignments
      const pending = myAssignments.filter(a => {
        const mySubmission = a.submissions?.find(s => s.student === user?.id);
        return !mySubmission || mySubmission.status === 'pending';
      }).length;

      // Fetch certificates
      const certsRes = await api.get('/certificates');
      const certs = certsRes.data.certificates || [];

      // Fetch badges
      const badgesRes = await api.get('/badges');
      const badges = badgesRes.data.badges || [];

      // Count registered events
      const registeredEvents = myEvents.filter(e =>
        e.participants?.some(p => p._id === user?.id)
      ).length;

      // Fetch attendance data
      let attendancePercentage = 0;
      try {
        const attendanceRes = await api.get(`/attendance/student/${user?.id}`);
        attendancePercentage = attendanceRes.data.statistics?.attendancePercentage || 0;
      } catch (error) {
        console.error('Error fetching attendance:', error);
      }

      setStats({
        eventsRegistered: registeredEvents,
        assignmentsPending: pending,
        certificates: certs.length,
        badges: badges.length,
        attendancePercentage,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <>
      <Navbar title="Student Dashboard" />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Welcome Section */}
        <Paper
          sx={{
            p: 4,
            mb: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
            animation: 'fadeIn 0.6s ease-out',
            '@keyframes fadeIn': {
              from: { opacity: 0, transform: 'translateY(20px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: '300px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
              borderRadius: '50%',
              transform: 'translate(30%, -30%)',
            },
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, position: 'relative', zIndex: 1 }}>
            Welcome back, {user?.name}! 👋
          </Typography>
          <Box display="flex" gap={2} mt={3} flexWrap="wrap" sx={{ position: 'relative', zIndex: 1 }}>
            <Chip
              label={`ID: ${user?.blockchainId}`}
              sx={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                color: '#fff',
                fontWeight: 600,
                border: '1px solid rgba(255, 255, 255, 0.3)',
              }}
            />
            <Chip
              label={`Year ${user?.year}`}
              sx={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                color: '#fff',
                fontWeight: 600,
                border: '1px solid rgba(255, 255, 255, 0.3)',
              }}
            />
            <Chip
              label={user?.department?.name || 'Department'}
              sx={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                color: '#fff',
                fontWeight: 600,
                border: '1px solid rgba(255, 255, 255, 0.3)',
              }}
            />
          </Box>
          <Button
            variant="contained"
            onClick={() => navigate('/my-classes')}
            sx={{
              mt: 3,
              bgcolor: 'white',
              color: 'primary.main',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
            }}
          >
            📚 Manage My Classes
          </Button>
        </Paper>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card
              onClick={() => navigate('/attendance')}
              sx={{
                background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                color: '#fff',
                cursor: 'pointer',
                animation: 'scaleIn 0.5s ease-out 0.1s both',
                '@keyframes scaleIn': {
                  from: { opacity: 0, transform: 'scale(0.9)' },
                  to: { opacity: 1, transform: 'scale(1)' },
                },
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '14px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <TrendingUpIcon fontSize="large" />
                  </Box>
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {stats.attendancePercentage.toFixed(1)}%
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Attendance
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card
              onClick={() => navigate('/events')}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                cursor: 'pointer',
                animation: 'scaleIn 0.5s ease-out 0.2s both',
                '@keyframes scaleIn': {
                  from: { opacity: 0, transform: 'scale(0.9)' },
                  to: { opacity: 1, transform: 'scale(1)' },
                },
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '14px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <EventIcon fontSize="large" />
                  </Box>
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {stats.eventsRegistered}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Events Registered
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card
              onClick={() => navigate('/assignments')}
              sx={{
                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                color: '#fff',
                cursor: 'pointer',
                animation: 'scaleIn 0.5s ease-out 0.3s both',
                '@keyframes scaleIn': {
                  from: { opacity: 0, transform: 'scale(0.9)' },
                  to: { opacity: 1, transform: 'scale(1)' },
                },
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '14px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <AssignmentIcon fontSize="large" />
                  </Box>
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {stats.assignmentsPending}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Assignments Pending
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card
              onClick={() => navigate('/certificates')}
              sx={{
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: '#fff',
                cursor: 'pointer',
                animation: 'scaleIn 0.5s ease-out 0.4s both',
                '@keyframes scaleIn': {
                  from: { opacity: 0, transform: 'scale(0.9)' },
                  to: { opacity: 1, transform: 'scale(1)' },
                },
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '14px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <EmojiEventsIcon fontSize="large" />
                  </Box>
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {stats.certificates}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Certificates Earned
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card
              onClick={() => navigate('/badges')}
              sx={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: '#fff',
                cursor: 'pointer',
                animation: 'scaleIn 0.5s ease-out 0.5s both',
                '@keyframes scaleIn': {
                  from: { opacity: 0, transform: 'scale(0.9)' },
                  to: { opacity: 1, transform: 'scale(1)' },
                },
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '14px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <BadgeIcon fontSize="large" />
                  </Box>
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {stats.badges}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Badges Collected
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Upcoming Events */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <EventIcon sx={{ color: '#fff' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Upcoming Events
                </Typography>
              </Box>
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event, index) => (
                  <Card
                    key={event._id}
                    sx={{
                      mb: 2,
                      animation: `slideIn 0.4s ease-out ${0.1 * index}s both`,
                      '@keyframes slideIn': {
                        from: { opacity: 0, transform: 'translateX(-20px)' },
                        to: { opacity: 1, transform: 'translateX(0)' },
                      },
                    }}
                  >
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {event.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        📅 {new Date(event.startDate).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        📍 {event.venue}
                      </Typography>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No upcoming events
                </Typography>
              )}
              <Button
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => navigate('/events')}
              >
                View All Events
              </Button>
            </Paper>
          </Grid>

          {/* Recent Assignments */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <AssignmentIcon sx={{ color: '#fff' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Recent Assignments
                </Typography>
              </Box>
              {recentAssignments.length > 0 ? (
                recentAssignments.map((assignment, index) => (
                  <Card
                    key={assignment._id}
                    sx={{
                      mb: 2,
                      animation: `slideIn 0.4s ease-out ${0.1 * index}s both`,
                      '@keyframes slideIn': {
                        from: { opacity: 0, transform: 'translateX(-20px)' },
                        to: { opacity: 1, transform: 'translateX(0)' },
                      },
                    }}
                  >
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {assignment.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        ⏰ Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        📚 {assignment.subject}
                      </Typography>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No assignments
                </Typography>
              )}
              <Button
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => navigate('/assignments')}
              >
                View All Assignments
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default StudentDashboard;
