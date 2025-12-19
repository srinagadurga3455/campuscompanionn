import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Divider,
  Table,
  Tooltip,
  AvatarGroup,
  Avatar,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../utils/api';

const ClubAdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [club, setClub] = useState(null);
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeMembers: 0,
    certificatesIssued: 0
  });
  const [certificateDialog, setCertificateDialog] = useState({ open: false, event: null });
  const [certificateType, setCertificateType] = useState('');
  const [certificateDescription, setCertificateDescription] = useState('');
  const [certificateFile, setCertificateFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [issuingCertificates, setIssuingCertificates] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch club info and events in parallel
      const [clubRes, eventsRes, certsRes] = await Promise.all([
        api.get('/clubs/my-club').catch(() => ({ data: { club: null } })),
        api.get('/events'),
        api.get('/certificates').catch(() => ({ data: { certificates: [] } }))
      ]);

      const clubData = clubRes.data.club;
      const eventsData = eventsRes.data.events || [];
      const certsData = certsRes.data.certificates || [];

      setClub(clubData);
      setEvents(eventsData);

      // Calculate stats
      const myCerts = certsData.filter(c => c.club === user?._id);
      setStats({
        totalEvents: eventsData.length,
        activeMembers: clubData?.members?.length || 0,
        certificatesIssued: myCerts.length
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      await api.delete(`/events/${eventId}`);
      setEvents(events.filter(e => e._id !== eventId));
      setStats({ ...stats, totalEvents: stats.totalEvents - 1 });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete event');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'primary';
      case 'ongoing': return 'success';
      case 'completed': return 'default';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getApprovalColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const handleIssueCertificates = (event) => {
    setCertificateDialog({ open: true, event });
    setCertificateType('Participation');
    setCertificateDescription(`Certificate of Participation for ${event.title}`);
    setCertificateFile(null);
    setFilePreview(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCertificateFile(file);
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleCertificateSubmit = async () => {
    if (!certificateDialog.event || !certificateType || !certificateDescription) return;

    setIssuingCertificates(true);
    try {
      const participants = certificateDialog.event.participants || [];

      if (participants.length === 0) {
        alert('No participants to issue certificates to');
        return;
      }

      // Issue certificates to all participants
      const promises = participants.map(participant => {
        const formData = new FormData();
        formData.append('title', certificateType);
        formData.append('description', certificateDescription);
        formData.append('recipient', participant._id);
        formData.append('event', certificateDialog.event._id);
        formData.append('certificateType', certificateType.toLowerCase());
        if (certificateFile) {
          formData.append('certificateFile', certificateFile);
        }

        return api.post('/certificates', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        }).catch(err => {
          console.error(`Failed to issue certificate to ${participant.name}:`, err);
          return { success: false, participant: participant.name };
        });
      });

      const results = await Promise.all(promises);
      const successCount = results.filter(r => r.success !== false).length;

      alert(`Successfully issued ${successCount}/${participants.length} certificates!`);
      setCertificateDialog({ open: false, event: null });
      setCertificateType('');
      setCertificateDescription('');
      setCertificateFile(null);
      setFilePreview(null);

      // Refresh stats
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to issue certificates');
    } finally {
      setIssuingCertificates(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 8 }}>
      <Navbar title="Organization Console" />

      <Container maxWidth="lg" sx={{ mt: { xs: 4, md: 6 } }}>
        <Box sx={{ mb: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.02em' }}>
            {club?.name || 'Club Administration'}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Managing <Box component="span" sx={{ color: 'primary.main', fontWeight: 700 }}>{user?.name}</Box> • Verified Organization
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

        {loading ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <CircularProgress />
            <Typography sx={{ mt: 2, color: 'text.secondary' }}>Loading dashboard...</Typography>
          </Box>
        ) : (
          <>
            {/* Stats Cards */}
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

            <Grid container spacing={4}>
              <Grid item xs={12} lg={8}>
                {/* Command Center */}
                <Paper sx={{ p: 4, borderRadius: '20px', border: '1px solid', borderColor: 'divider', mb: 4 }}>
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

                {/* My Events */}
                <Paper sx={{ p: 4, borderRadius: '20px', border: '1px solid', borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>My Events</Typography>
                    <Chip label={`${events.length} Total`} sx={{ fontWeight: 700 }} />
                  </Box>

                  {events.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8, bgcolor: 'rgba(0,0,0,0.01)', borderRadius: '12px' }}>
                      <EventIcon sx={{ fontSize: 48, color: 'text.muted', opacity: 0.3, mb: 2 }} />
                      <Typography variant="body1" sx={{ color: 'text.muted', fontWeight: 600 }}>
                        No events created yet
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={() => navigate('/create-event')}
                        sx={{ mt: 2 }}
                      >
                        Create Your First Event
                      </Button>
                    </Box>
                  ) : (
                    <Box sx={{ overflowX: 'auto' }}>
                      <Table>
                        <TableHead>
                          <TableRow sx={{ '& th': { fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', color: 'text.muted' } }}>
                            <TableCell>Event</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Approval</TableCell>
                            <TableCell>Participants</TableCell>
                            <TableCell align="right">Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {events.map((event) => (
                            <TableRow key={event._id} sx={{ '& td': { py: 2 } }}>
                              <TableCell>
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>{event.title}</Typography>
                                <Typography variant="caption" sx={{ color: 'text.muted' }}>{event.eventType}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  {new Date(event.startDate).toLocaleDateString()}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip label={event.status} color={getStatusColor(event.status)} size="small" sx={{ fontWeight: 700 }} />
                              </TableCell>
                              <TableCell>
                                <Chip label={event.approvalStatus} color={getApprovalColor(event.approvalStatus)} size="small" sx={{ fontWeight: 700 }} />
                              </TableCell>
                              <TableCell>
                                {event.participants && event.participants.length > 0 ? (
                                  <Tooltip
                                    title={
                                      <Box sx={{ p: 1 }}>
                                        <Typography variant="caption" sx={{ fontWeight: 700, mb: 1, display: 'block' }}>
                                          Registered Participants:
                                        </Typography>
                                        {event.participants.map((participant, idx) => (
                                          <Typography key={idx} variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                                            {participant.name || participant.email || 'Unknown'}
                                          </Typography>
                                        ))}
                                      </Box>
                                    }
                                    arrow
                                  >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}>
                                      <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.75rem' } }}>
                                        {event.participants.slice(0, 3).map((participant, idx) => (
                                          <Avatar key={idx} sx={{ bgcolor: 'primary.main' }}>
                                            {(participant.name || participant.email || 'U').charAt(0).toUpperCase()}
                                          </Avatar>
                                        ))}
                                      </AvatarGroup>
                                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                        {event.participants.length}
                                      </Typography>
                                    </Box>
                                  </Tooltip>
                                ) : (
                                  <Typography variant="body2" sx={{ color: 'text.muted' }}>0</Typography>
                                )}
                              </TableCell>
                              <TableCell align="right">
                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                  <Tooltip title="View Event">
                                    <IconButton
                                      size="small"
                                      onClick={() => navigate(`/events/${event._id}/register`)}
                                      sx={{ color: 'primary.main' }}
                                    >
                                      <VisibilityIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Issue Certificates">
                                    <IconButton
                                      size="small"
                                      onClick={() => handleIssueCertificates(event)}
                                      sx={{ color: 'success.main' }}
                                      disabled={!event.participants || event.participants.length === 0}
                                    >
                                      <EmojiEventsIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Delete Event">
                                    <IconButton
                                      size="small"
                                      onClick={() => handleDeleteEvent(event._id)}
                                      sx={{ color: 'error.main' }}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Stack>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Box>
                  )}
                </Paper>
              </Grid>

              <Grid item xs={12} lg={4}>
                {/* Club Info */}
                <Paper sx={{ p: 4, borderRadius: '24px', border: '1px solid', borderColor: 'divider', bgcolor: 'rgba(79,70,229,0.02)' }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Club Information</Typography>
                  <Divider sx={{ mb: 3 }} />
                  <Stack spacing={3}>
                    {club ? (
                      <>
                        <Box>
                          <Typography variant="caption" sx={{ color: 'text.muted', fontWeight: 700, textTransform: 'uppercase' }}>Club Name</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>{club.name}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ color: 'text.muted', fontWeight: 700, textTransform: 'uppercase' }}>Category</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{club.category || 'General'}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ color: 'text.muted', fontWeight: 700, textTransform: 'uppercase' }}>Total Members</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{club.members?.length || 0}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ color: 'text.muted', fontWeight: 700, textTransform: 'uppercase' }}>Description</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{club.description || 'No description available'}</Typography>
                        </Box>
                      </>
                    ) : (
                      <Box>
                        <Typography variant="body2" sx={{ color: 'text.muted' }}>No club information available</Typography>
                      </Box>
                    )}
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
          </>
        )}

        {/* Certificate Issuance Dialog */}
        <Dialog
          open={certificateDialog.open}
          onClose={() => setCertificateDialog({ open: false, event: null })}
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { borderRadius: '20px' } }}
        >
          <DialogTitle sx={{ fontWeight: 800 }}>
            Issue Certificates - {certificateDialog.event?.title}
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              Issue certificates to all {certificateDialog.event?.participants?.length || 0} participants of this event.
            </Typography>
            <TextField
              fullWidth
              label="Certificate Type"
              value={certificateType}
              onChange={(e) => setCertificateType(e.target.value)}
              sx={{ mb: 2 }}
              placeholder="e.g., Participation, Winner, Achievement"
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={certificateDescription}
              onChange={(e) => setCertificateDescription(e.target.value)}
              placeholder="Describe the achievement or participation"
              sx={{ mb: 2 }}
            />

            <Box sx={{ mb: 2 }}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ py: 1.5, borderRadius: '12px', fontWeight: 700 }}
              >
                {certificateFile ? certificateFile.name : 'Upload Certificate File (Optional)'}
                <input
                  type="file"
                  hidden
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileChange}
                />
              </Button>
              {filePreview && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <img src={filePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }} />
                </Box>
              )}
              {certificateFile && !filePreview && (
                <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'success.main' }}>
                  ✓ {certificateFile.name} selected
                </Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={() => setCertificateDialog({ open: false, event: null })}
              sx={{ fontWeight: 700 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCertificateSubmit}
              variant="contained"
              disabled={issuingCertificates || !certificateType || !certificateDescription}
              sx={{ fontWeight: 700 }}
            >
              {issuingCertificates ? 'Issuing...' : `Issue to ${certificateDialog.event?.participants?.length || 0} Participants`}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default ClubAdminDashboard;
