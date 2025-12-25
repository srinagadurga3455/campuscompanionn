import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  LinearProgress,
} from '@mui/material';
// ...
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import EventIcon from '@mui/icons-material/Event';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import BadgeIcon from '@mui/icons-material/Badge';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SchoolIcon from '@mui/icons-material/School';
import MailIcon from '@mui/icons-material/Mail';
import PaidIcon from '@mui/icons-material/Paid';
import api, { SERVER_URL } from '../../utils/api';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showMailbox, setShowMailbox] = useState(false);

  useEffect(() => {
    if (location.state?.scrollToMailbox) {
      setShowMailbox(true);
      setTimeout(() => {
        const mailboxElement = document.getElementById('mailbox');
        if (mailboxElement) {
          mailboxElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const [stats, setStats] = useState({
    eventsRegistered: 0,
    assignmentsPending: 0,
    certificates: 0,
    badges: 0,
    attendancePercentage: 0,
  });
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recentAssignments, setRecentAssignments] = useState([]);
  const [myCertificates, setMyCertificates] = useState([]);
  const [unclaimedCertificates, setUnclaimedCertificates] = useState([]);

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
      const allCerts = certsRes.data.certificates || [];
      const claimed = allCerts.filter(c => c.isClaimed);
      const unclaimed = allCerts.filter(c => !c.isClaimed);
      setMyCertificates(claimed);
      setUnclaimedCertificates(unclaimed);

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
        eventsRegistered: registeredEventsCount,
        assignmentsPending: pending,
        certificates: claimed.length,
        badges: badges.length,
        attendancePercentage,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleClaimCertificate = async (certId) => {
    try {
      await api.put(`/certificates/claim/${certId}`);
      // Move from unclaimed to claimed
      const cert = unclaimedCertificates.find(c => c._id === certId);
      setUnclaimedCertificates(prev => prev.filter(c => c._id !== certId));
      setMyCertificates(prev => [cert, ...prev]);
    } catch (error) {
      console.error('Error claiming certificate:', error);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 8 }}>
      <Navbar title="Student Center" />

      <Container maxWidth="lg" sx={{ mt: { xs: 2, md: 4 }, pt: 2 }}>
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

        {/* Mailbox Section - Only visible when explicitly opened */}
        {showMailbox && (
          <Paper
            id="mailbox"
            elevation={0}
            sx={{
              p: 4,
              mb: 6,
              borderRadius: '24px',
              border: '1px solid',
              borderColor: unclaimedCertificates.length > 0 ? 'primary.main' : 'divider',
              bgcolor: unclaimedCertificates.length > 0 ? 'rgba(79,70,229,0.04)' : 'background.paper',
              position: 'relative',
              overflow: 'hidden',
              animation: 'fadeIn 0.5s ease-out',
              '@keyframes fadeIn': {
                '0%': { opacity: 0, transform: 'translateY(20px)' },
                '100%': { opacity: 1, transform: 'translateY(0)' }
              }
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: unclaimedCertificates.length > 0 ? 'primary.main' : 'action.disabledBackground', color: unclaimedCertificates.length > 0 ? 'white' : 'text.disabled', mr: 2 }}>
                  <MailIcon />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: unclaimedCertificates.length > 0 ? 'text.primary' : 'text.secondary' }}>Certificate Mailbox</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {unclaimedCertificates.length > 0
                      ? `You have ${unclaimedCertificates.length} unclaimed certificates waiting for you!`
                      : "No new certificates at the moment."}
                  </Typography>
                </Box>
              </Box>
              <Button
                onClick={() => setShowMailbox(false)}
                sx={{ minWidth: 'auto', p: 1, borderRadius: '50%' }}
                color="inherit"
              >
                ✕
              </Button>
            </Box>

            {unclaimedCertificates.length > 0 ? (
              <Grid container spacing={3}>
                {unclaimedCertificates.map((cert) => (
                  <Grid item xs={12} md={6} key={cert._id}>
                    <Card sx={{ borderRadius: '16px', border: '1px solid', borderColor: 'divider' }}>
                      <CardContent sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>{cert.title}</Typography>
                          <Typography variant="caption" sx={{ color: 'text.muted' }}>
                            Issued by: {cert.issuer?.name || 'Admin'}
                          </Typography>
                        </Box>
                        <Button
                          variant="contained"
                          onClick={() => handleClaimCertificate(cert._id)}
                          sx={{ borderRadius: '8px', fontWeight: 700, px: 3 }}
                        >
                          Claim
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ py: 4, textAlign: 'center', border: '1px dashed', borderColor: 'divider', borderRadius: '16px' }}>
                <Typography color="text.secondary">All caught up! No unclaimed certificates.</Typography>
              </Box>
            )}
          </Paper>
        )}

        {/* Quick Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {[

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


        {/* Pending Payments Section */}
        {upcomingEvents.some(e => e.pendingRegistrations?.some(p => p.user === user?.id || p.user?._id === user?.id)) && (
          <Paper
            sx={{
              p: 3,
              mb: 4,
              borderRadius: '20px',
              bgcolor: '#fff7ed',
              border: '1px solid',
              borderColor: '#fdba74'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ p: 1, bgcolor: 'warning.main', borderRadius: '50%', color: 'white', mr: 2 }}>
                <PaidIcon />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: 'warning.dark' }}>Action Required: Complete Payment</Typography>
                <Typography variant="body2" sx={{ color: 'warning.dark' }}>
                  You have pending registrations that require payment confirmation.
                </Typography>
              </Box>
            </Box>
            <Grid container spacing={2}>
              {upcomingEvents
                .filter(e => e.pendingRegistrations?.some(p => p.user === user?.id || p.user?._id === user?.id))
                .map(event => (
                  <Grid item xs={12} md={6} key={event._id}>
                    <Card sx={{ borderRadius: '12px', border: '1px solid', borderColor: 'warning.light' }}>
                      <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{event.title}</Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Amount: ₹{event.registrationFee}</Typography>
                        </Box>
                        <Button
                          variant="contained"
                          color="warning"
                          size="small"
                          onClick={() => navigate(`/events/${event._id}/payment`)}
                        >
                          Pay Now
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              }
            </Grid>
          </Paper>
        )}

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
              <Button size="small" sx={{ fontWeight: 700 }} onClick={() => navigate('/events')}>Explore</Button>
            </Box>
            <Stack spacing={2}>
              {upcomingEvents.length > 0 ? upcomingEvents.map((event, i) => (
                <Card
                  key={i}
                  sx={{
                    borderRadius: '16px',
                    border: '1px solid',
                    borderColor: 'divider',
                    cursor: 'pointer',
                    '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(79,70,229,0.02)' }
                  }}
                  onClick={() => navigate(`/events/${event._id}/register`)}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'rgba(0,0,0,0.03)', height: 'fit-content' }}>
                        <EventIcon sx={{ color: 'primary.main' }} />
                      </Box>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 700, mb: 0.5 }}>{event.title}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.muted', display: 'block' }}>
                          {event.startDate ? new Date(event.startDate).toDateString() : 'Date TBD'}
                        </Typography>
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

        {/* My Certificates Section */}
        {myCertificates.length > 0 && (
          <Box sx={{ mt: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                My Certificates
              </Typography>
              <Chip label={`${myCertificates.length} Total`} sx={{ fontWeight: 700 }} />
            </Box>

            <Grid container spacing={3}>
              {myCertificates.map((cert) => (
                <Grid item xs={12} sm={6} md={4} key={cert._id}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: '16px',
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 3
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <EmojiEventsIcon sx={{ color: 'primary.main', fontSize: 32, mr: 1.5 }} />
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                            {cert.title}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.muted' }}>
                            {new Date(cert.issuedDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>

                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                        {cert.description}
                      </Typography>

                      {cert.event && (
                        <Chip
                          label={cert.event.title}
                          size="small"
                          sx={{ mb: 2, fontWeight: 600 }}
                        />
                      )}

                      <Divider sx={{ my: 2 }} />

                      <Stack direction="row" spacing={1}>
                        {cert.certificateFile && (
                          <Button
                            variant="contained"
                            size="small"
                            fullWidth
                            onClick={() => window.open(`${SERVER_URL}${cert.certificateFile}`, '_blank')}
                            sx={{ fontWeight: 700, borderRadius: '8px' }}
                          >
                            View
                          </Button>
                        )}
                        {cert.certificateFile && (
                          <Button
                            variant="contained"
                            size="small"
                            fullWidth
                            component="a"
                            href={`${SERVER_URL}${cert.certificateFile}`}
                            download
                            sx={{ fontWeight: 700, borderRadius: '8px', bgcolor: 'success.main', '&:hover': { bgcolor: 'success.dark' } }}
                          >
                            Download
                          </Button>
                        )}
                        {cert.verificationUrl && (
                          <Button
                            variant="outlined"
                            size="small"
                            fullWidth
                            onClick={() => window.open(cert.verificationUrl, '_blank')}
                            sx={{ fontWeight: 700, borderRadius: '8px' }}
                          >
                            Verify
                          </Button>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default StudentDashboard;
