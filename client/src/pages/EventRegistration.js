import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  TextField,
  FormControlLabel,
  Checkbox,
  Snackbar,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PaidIcon from '@mui/icons-material/Paid';
import CategoryIcon from '@mui/icons-material/Category';
import GroupsIcon from '@mui/icons-material/Groups';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import api from '../utils/api';

const EventRegistration = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    phoneNumber: '',
    reason: '',
  });
  const [teamData, setTeamData] = useState({
    teamName: '',
    members: []
  });

  // Initialize team members based on min size when event loads
  useEffect(() => {
    if (event?.participationType === 'team' && event?.teamSize?.min > 1) {
      const initialMembers = Array(event.teamSize.min - 1).fill({
        name: '',
        branch: '',
        phone: '',
        email: ''
      });
      setTeamData(prev => ({ ...prev, members: initialMembers }));
    }
  }, [event]);

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/events/${eventId}`);
      setEvent(response.data.event);
      setError('');
    } catch (error) {
      console.error('Error fetching event:', error);
      setError(error.response?.data?.message || 'Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setRegistrationData({
      ...registrationData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTeamMemberChange = (index, field, value) => {
    const updatedMembers = [...teamData.members];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setTeamData({ ...teamData, members: updatedMembers });
  };

  const addTeamMember = () => {
    if (teamData.members.length + 1 < (event?.teamSize?.max || 5)) {
      setTeamData({
        ...teamData,
        members: [...teamData.members, { name: '', branch: '', phone: '', email: '' }]
      });
    }
  };

  const removeTeamMember = (index) => {
    const updatedMembers = teamData.members.filter((_, i) => i !== index);
    setTeamData({ ...teamData, members: updatedMembers });
  };

  const handleRegister = async () => {
    if (!agreeTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const payload = {
        ...registrationData,
        ...(event.participationType === 'team' ? teamData : {})
      };

      const res = await api.post(`/events/${eventId}/register`, payload);
      setSuccess('Successfully registered for the event!');

      // Handle Payment Redirect if applicable
      if (event?.registrationFee > 0 && event?.paymentLink) {
        setSuccess('Registration successful! Redirecting to payment page...');
        setTimeout(() => {
          navigate(`/events/${eventId}/payment`);
        }, 1000);
      } else {
        setSuccess('Successfully registered for the event! You will receive a confirmation email.');
        // Redirect to events page after 2 seconds
        setTimeout(() => {
          navigate('/events');
        }, 2000);
      }
    } catch (error) {
      console.error('Error registering:', error);
      setError(error.response?.data?.message || 'Failed to register for event');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isRegistrationClosed = () => {
    if (!event) return false;
    if (event.registrationDeadline && new Date() > new Date(event.registrationDeadline)) {
      return true;
    }
    if (event.maxParticipants && event.participants?.length >= event.maxParticipants) {
      return true;
    }
    return false;
  };

  const isAlreadyRegistered = () => {
    // Check confirmed participants
    return event?.participants?.some(p => p._id === user?.id || p === user?.id) ||
      event?.teamRegistrations?.some(t => t.leader === user?.id);
  };

  const isPendingPayment = () => {
    return event?.pendingRegistrations?.some(p => p.user === user?.id || p.user?._id === user?.id);
  };

  if (loading) {
    return (
      <>
        <Navbar title="Event Registration" />
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress size={60} />
          </Box>
        </Container>
      </>
    );
  }

  if (error && !event) {
    return (
      <>
        <Navbar title="Event Registration" />
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
          <Alert severity="error">{error}</Alert>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/events')}
            sx={{ mt: 2 }}
          >
            Back to Events
          </Button>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar title="Event Registration" />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/events')}
          sx={{ mb: 2 }}
        >
          Back to Events
        </Button>

        {success && (
          <Alert severity="success" sx={{ mb: 2 }} icon={<CheckCircleIcon />}>
            {success}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <EventIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Box flex={1}>
              <Typography variant="h4" gutterBottom>
                {event?.title}
              </Typography>
              <Chip
                label={event?.eventType}
                size="small"
                color="primary"
                sx={{ textTransform: 'capitalize' }}
              />
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Event Details
          </Typography>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <CalendarMonthIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Start Date
                  </Typography>
                  <Typography variant="body2">{formatDate(event?.startDate)}</Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <CalendarMonthIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    End Date
                  </Typography>
                  <Typography variant="body2">{formatDate(event?.endDate)}</Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <LocationOnIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Venue
                  </Typography>
                  <Typography variant="body2">{event?.venue}</Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <PaidIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Registration Fee
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: event?.registrationFee > 0 ? 'error.main' : 'success.main' }}>
                    {event?.registrationFee && event?.registrationFee > 0
                      ? `₹${event.registrationFee} per person`
                      : 'Free'}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <PeopleIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Participants
                  </Typography>
                  <Typography variant="body2">
                    {event?.participants?.length || 0}
                    {event?.maxParticipants && ` / ${event.maxParticipants}`} registered
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {event?.registrationDeadline && (
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <AccessTimeIcon color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Registration Deadline
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(event.registrationDeadline)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            )}

            {event?.club && (
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <GroupsIcon color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Organized By
                    </Typography>
                    <Typography variant="body2">{event.club.name}</Typography>
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Description
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {event?.description}
          </Typography>
        </Paper>

        {user?.role === 'student' && (
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              {isAlreadyRegistered() ? 'Already Registered' : isPendingPayment() ? 'Complete Your Registration' : 'Register for Event'}
            </Typography>

            {isAlreadyRegistered() ? (
              <Alert severity="success" icon={<CheckCircleIcon />}>
                You are already registered for this event. We look forward to seeing you there!
              </Alert>
            ) : isPendingPayment() ? (
              <Alert severity="warning" action={
                <Button color="inherit" size="small" onClick={() => navigate(`/events/${eventId}/payment`)}>
                  Complete Payment
                </Button>
              }>
                Your registration is pending payment. Please complete the payment to confirm your spot.
              </Alert>
            ) : isRegistrationClosed() ? (
              <Alert severity="warning">
                {event?.registrationDeadline && new Date() > new Date(event.registrationDeadline)
                  ? 'Registration deadline has passed'
                  : 'Event is full - maximum participants reached'}
              </Alert>
            ) : (
              <>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Please fill in the following details to complete your registration.
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phoneNumber"
                      value={registrationData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Enter your contact number"
                      helperText="We'll use this to contact you about the event"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Why do you want to attend? (Optional)"
                      name="reason"
                      value={registrationData.reason}
                      onChange={handleInputChange}
                      placeholder="Share your interest or expectations from this event"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Card variant="outlined" sx={{ bgcolor: 'grey.50' }}>
                      <CardContent>
                        <Typography variant="subtitle2" gutterBottom>
                          Terms & Conditions
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          • I confirm my attendance for this event
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          • I understand that I will receive event updates via email
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          • I will follow all event rules and guidelines
                        </Typography>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={agreeTerms}
                              onChange={(e) => setAgreeTerms(e.target.checked)}
                              color="primary"
                            />
                          }
                          label="I agree to the terms and conditions"
                        />
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12}>
                    <Grid item xs={12}>
                      <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        onClick={handleRegister}
                        disabled={submitting || !agreeTerms}
                        startIcon={submitting ? <CircularProgress size={20} /> : <CheckCircleIcon />}
                      >
                        {submitting
                          ? 'Registering...'
                          : (event?.registrationFee > 0 ? 'Register & Pay' : 'Confirm Registration')}
                      </Button>
                    </Grid>

                    {/* Team Registration Form */}
                    {event?.participationType === 'team' && (
                      <Grid item xs={12}>
                        <Divider sx={{ my: 2 }}>
                          <Chip label="Team Details" />
                        </Divider>

                        <TextField
                          fullWidth
                          label="Team Name"
                          value={teamData.teamName}
                          onChange={(e) => setTeamData({ ...teamData, teamName: e.target.value })}
                          sx={{ mb: 3 }}
                          required
                        />

                        <Typography variant="subtitle2" sx={{ mb: 2 }}>
                          Team Members (You + {teamData.members.length} others)
                        </Typography>

                        {teamData.members.map((member, index) => (
                          <Card key={index} variant="outlined" sx={{ mb: 2, p: 2, position: 'relative' }}>
                            <Typography variant="caption" sx={{ fontWeight: 700, mb: 1, display: 'block' }}>
                              Member #{index + 2}
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  size="small"
                                  label="Name"
                                  value={member.name}
                                  onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
                                  required
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  size="small"
                                  label="Branch"
                                  value={member.branch}
                                  onChange={(e) => handleTeamMemberChange(index, 'branch', e.target.value)}
                                  required
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  size="small"
                                  label="Phone"
                                  value={member.phone}
                                  onChange={(e) => handleTeamMemberChange(index, 'phone', e.target.value)}
                                  required
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  size="small"
                                  label="Email"
                                  value={member.email}
                                  onChange={(e) => handleTeamMemberChange(index, 'email', e.target.value)}
                                  required
                                />
                              </Grid>
                            </Grid>
                            {/* Only allow removing if we serve above min participants */}
                            {(teamData.members.length + 1 > (event?.teamSize?.min || 1)) && (
                              <Button
                                size="small"
                                color="error"
                                onClick={() => removeTeamMember(index)}
                                sx={{ mt: 1 }}
                              >
                                Remove
                              </Button>
                            )}
                          </Card>
                        ))}

                        {(teamData.members.length + 1 < (event?.teamSize?.max || 5)) && (
                          <Button
                            variant="outlined"
                            onClick={addTeamMember}
                            fullWidth
                            sx={{ borderStyle: 'dashed' }}
                          >
                            + Add Team Member
                          </Button>
                        )}
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </>
            )}
          </Paper>
        )}

        <Snackbar
          open={!!success}
          autoHideDuration={6000}
          onClose={() => setSuccess('')}
        >
          <Alert severity="success" onClose={() => setSuccess('')}>
            {success}
          </Alert>
        </Snackbar>
      </Container >
    </>
  );
};

export default EventRegistration;
