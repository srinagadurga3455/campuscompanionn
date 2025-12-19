import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import {
  Container,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import EventIcon from '@mui/icons-material/Event';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import BadgeIcon from '@mui/icons-material/Badge';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SchoolIcon from '@mui/icons-material/School';
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
  }, [user?.id]);

  const fetchDashboardData = async () => {
    try {
      const eventsRes = await api.get('/events?upcoming=true');
      const myEvents = eventsRes.data.events || [];
      setUpcomingEvents(myEvents.slice(0, 3));

      const assignmentsRes = await api.get('/assignments');
      const myAssignments = assignmentsRes.data.assignments || [];
      setRecentAssignments(myAssignments.slice(0, 3));

      const pending = myAssignments.filter(a => {
        const mySubmission = a.submissions?.find(s => s.student === user?.id);
        return !mySubmission || mySubmission.status === 'pending';
      }).length;

      const certsRes = await api.get('/certificates');
      const certs = certsRes.data.certificates || [];

      const badgesRes = await api.get('/badges');
      const badges = badgesRes.data.badges || [];

      const registeredEventsCount = myEvents.filter(e =>
        e.participants?.some(p => p._id === user?.id)
      ).length;

      let attendancePercentage = 0;
      try {
        const attendanceRes = await api.get(`/attendance/student/${user?.id}`);
        attendancePercentage = attendanceRes.data.statistics?.attendancePercentage || 0;
      } catch (error) {
        console.error('Error fetching attendance:', error);
      }

      setStats({
        eventsRegistered: registeredEventsCount,
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
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 8 }}>
      <Navbar title="Student Center" />

      <Container maxWidth="lg" sx={{ mt: { xs: 4, md: 6 } }}>
        {/* Modern Header Section */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            mb: 6,
            bgcolor: 'background.paper',
            borderRadius: '24px',
            border: '1px solid',
            borderColor: 'divider',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ position: 'absolute', top: -100, right: -100, width: 300, height: 300, background: 'radial-gradient(circle, rgba(79,70,229,0.05) 0%, transparent 70%)', filter: 'blur(60px)' }} />

          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '8px',
                    bgcolor: 'rgba(79,70,229,0.1)',
                    color: 'primary.main',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  Student Profile Verified
                </Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  <Box component="span" sx={{ color: 'text.muted', mr: 1 }}>ID:</Box>{user?.blockchainId}
                </Typography>
              </Box>
              <Typography variant="h2" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-0.025em' }}>
                Welcome, {user?.name.split(' ')[0]}
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 500, mb: 4 }}>
                Keep track of your academic progress and campus activities.
              </Typography>

              <Stack direction="row" spacing={2}>
                <Button variant="contained" size="large" onClick={() => navigate('/assignments')} sx={{ borderRadius: '12px', fontWeight: 700, px: 3 }}>
                  View Assignments
                </Button>
                <Button variant="outlined" size="large" onClick={() => navigate('/attendance')} sx={{ borderRadius: '12px', fontWeight: 700, px: 3, borderColor: 'divider' }}>
                  Attendance Report
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        {/* Quick Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {[
            { label: 'Attendance', value: `${stats.attendancePercentage}%`, icon: <TrendingUpIcon />, color: '#10b981' },
            { label: 'Assignments', value: stats.assignmentsPending, icon: <AssignmentIcon />, color: '#6366f1' },
            { label: 'NFT Badges', value: stats.badges, icon: <BadgeIcon />, color: '#f59e0b' },
            { label: 'Cerificates', value: stats.certificates, icon: <EmojiEventsIcon />, color: '#8b5cf6' },
          ].map((stat, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: '20px',
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.2s ease',
                  '&:hover': { transform: 'translateY(-4px)', borderColor: 'primary.main', boxShadow: 'lg' }
                }}
              >
                <Box sx={{ color: stat.color, mb: 2, display: 'flex', justifyContent: 'center' }}>
                  {React.cloneElement(stat.icon, { sx: { fontSize: 32 } })}
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, textAlign: 'center', color: 'text.primary' }}>
                  {stat.value}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={4}>
          {/* Recent Assignments */}
          <Grid item xs={12} md={7}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>Recent Assignments</Typography>
              <Button size="small" endIcon={<ArrowForwardIcon />} sx={{ fontWeight: 700 }}>View All</Button>
            </Box>
            <Stack spacing={2}>
              {recentAssignments.length > 0 ? recentAssignments.map((assignment, i) => (
                <Paper key={i} sx={{ p: 2.5, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid', borderColor: 'divider' }}>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 700, mb: 0.5 }}>{assignment.title}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.muted' }}>Due: {new Date(assignment.dueDate).toLocaleDateString()}</Typography>
                  </Box>
                  <Chip
                    label={assignment.submissions?.find(s => s.student === user?.id)?.status || 'Pending'}
                    size="small"
                    color={assignment.submissions?.find(s => s.student === user?.id)?.status === 'submitted' ? 'success' : 'warning'}
                    sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '10px' }}
                  />
                </Paper>
              )) : (
                <Paper sx={{ p: 4, borderRadius: '16px', textAlign: 'center', border: '1px dashed', borderColor: 'divider' }}>
                  <Typography color="text.secondary">No active assignments</Typography>
                </Paper>
              )}
            </Stack>
          </Grid>

          {/* Upcoming Events */}
          <Grid item xs={12} md={5}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>Events Feed</Typography>
              <Button size="small" sx={{ fontWeight: 700 }}>Explore</Button>
            </Box>
            <Stack spacing={2}>
              {upcomingEvents.length > 0 ? upcomingEvents.map((event, i) => (
                <Card key={i} sx={{ borderRadius: '16px', border: '1px solid', borderColor: 'divider' }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'rgba(0,0,0,0.03)', height: 'fit-content' }}>
                        <EventIcon sx={{ color: 'primary.main' }} />
                      </Box>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 700, mb: 0.5 }}>{event.title}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.muted', display: 'block' }}>{new Date(event.date).toDateString()}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              )) : (
                <Paper sx={{ p: 4, borderRadius: '16px', textAlign: 'center', border: '1px dashed', borderColor: 'divider' }}>
                  <Typography color="text.secondary">No upcoming events</Typography>
                </Paper>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default StudentDashboard;
