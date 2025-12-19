import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import {
  Container,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import api from '../../utils/api';

const ClubAdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeMembers: 0,
    certificatesIssued: 0
  });

  useEffect(() => {
    fetchClubStats();
  }, []);

  const fetchClubStats = async () => {
    try {
      const eventsRes = await api.get('/events');
      const myEvents = eventsRes.data.events?.filter(e => e.organizer === user?.id) || [];

      const certsRes = await api.get('/certificates');
      const myCerts = certsRes.data.certificates?.filter(c => c.club === user?.id) || [];

      setStats({
        totalEvents: myEvents.length,
        activeMembers: 124, // Mock for now
        certificatesIssued: myCerts.length
      });
    } catch (error) {
      console.error('Error fetching club stats:', error);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 8 }}>
      <Navbar title="Organization Console" />

      <Container maxWidth="lg" sx={{ mt: { xs: 4, md: 6 } }}>
        <Box sx={{ mb: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.02em' }}>
            Club Administration
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Managing <Box component="span" sx={{ color: 'primary.main', fontWeight: 700 }}>{user?.name}</Box> • Verified Organization
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {[
                { label: 'Events Organized', value: stats.totalEvents, icon: <EventIcon />, color: '#6366f1' },
                { label: 'Active Members', value: stats.activeMembers, icon: <PeopleIcon />, color: '#10b981' },
                { label: 'Certs Issued', value: stats.certificatesIssued, icon: <EmojiEventsIcon />, color: '#f59e0b' },
              ].map((stat, i) => (
                <Grid item xs={12} sm={4} key={i}>
                  <Paper
                    sx={{
                      p: 3,
                      borderRadius: '16px',
                      bgcolor: 'background.paper',
                      border: '1px solid',
                      borderColor: 'divider',
                      textAlign: 'center'
                    }}
                  >
                    <Box sx={{ color: stat.color, mb: 1.5, display: 'flex', justifyContent: 'center' }}>
                      {stat.icon}
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 900, mb: 0.5, color: 'text.primary' }}>{stat.value}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.muted', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.65rem' }}>
                      {stat.label}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* Admin Console Actions */}
            <Paper sx={{ p: 4, borderRadius: '20px', border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>Command Center</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/create-event')}
                    sx={{ py: 2, borderRadius: '12px', fontWeight: 700 }}
                  >
                    Create New Event
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/issue-certificates')}
                    sx={{ py: 2, borderRadius: '12px', fontWeight: 700, borderColor: 'divider', color: 'text.secondary' }}
                  >
                    Issue NFT Badges
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 4, borderRadius: '24px', border: '1px solid', borderColor: 'divider', height: '100%', bgcolor: 'rgba(79,70,229,0.02)' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Institutional Info</Typography>
              <Divider sx={{ mb: 3 }} />
              <Stack spacing={3}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.muted', fontWeight: 700, textTransform: 'uppercase' }}>Affiliation Status</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>Level 3 Verified Club</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.muted', fontWeight: 700, textTransform: 'uppercase' }}>Governance</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Standard Student Body Rules Apply</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.muted', fontWeight: 700, textTransform: 'uppercase' }}>Blockchain ID</Typography>
                  <Typography variant="caption" sx={{ display: 'block', wordBreak: 'break-all', fontFamily: 'monospace', color: 'text.secondary' }}>
                    0x71C7656EC7ab88b098defB751B7401B5f6d8976F
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ClubAdminDashboard;
