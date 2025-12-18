import React, { useState, useEffect } from 'react';
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
import api from '../../utils/api';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    eventsRegistered: 0,
    assignmentsPending: 0,
    certificates: 0,
    badges: 0,
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
      
      setStats({
        eventsRegistered: registeredEvents,
        assignmentsPending: pending,
        certificates: certs.length,
        badges: badges.length,
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
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Welcome, {user?.name}!
          </Typography>
          <Box display="flex" gap={2} mt={2}>
            <Chip label={`ID: ${user?.blockchainId}`} color="primary" />
            <Chip label={`Year ${user?.year}`} />
            <Chip label={user?.department?.name || 'Department'} />
          </Box>
        </Paper>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <EventIcon color="primary" fontSize="large" />
                  <Box>
                    <Typography variant="h4">{stats.eventsRegistered}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Events Registered
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <AssignmentIcon color="warning" fontSize="large" />
                  <Box>
                    <Typography variant="h4">{stats.assignmentsPending}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Assignments Pending
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <EmojiEventsIcon color="success" fontSize="large" />
                  <Box>
                    <Typography variant="h4">{stats.certificates}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Certificates Earned
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <BadgeIcon color="info" fontSize="large" />
                  <Box>
                    <Typography variant="h4">{stats.badges}</Typography>
                    <Typography variant="body2" color="text.secondary">
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
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Upcoming Events
              </Typography>
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <Card key={event._id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="subtitle1">{event.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(event.startDate).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2">{event.venue}</Typography>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No upcoming events
                </Typography>
              )}
              <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
                View All Events
              </Button>
            </Paper>
          </Grid>

          {/* Recent Assignments */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recent Assignments
              </Typography>
              {recentAssignments.length > 0 ? (
                recentAssignments.map((assignment) => (
                  <Card key={assignment._id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="subtitle1">{assignment.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2">{assignment.subject}</Typography>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No assignments
                </Typography>
              )}
              <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
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
