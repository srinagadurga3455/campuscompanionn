import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Avatar,
  IconButton,
  Alert,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../utils/api';

const Events = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, eventId: null, eventTitle: '' });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: '',
    startDate: '',
    endDate: '',
    venue: '',
    maxParticipants: '',
    registrationDeadline: '',
  });

  const eventTypes = [
    { value: 'workshop', label: 'Workshop' },
    { value: 'seminar', label: 'Seminar' },
    { value: 'competition', label: 'Competition' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'sports', label: 'Sports' },
    { value: 'technical', label: 'Technical' },
    { value: 'other', label: 'Other' },
  ];

  const statusColors = {
    upcoming: 'primary',
    ongoing: 'success',
    completed: 'default',
    cancelled: 'error',
  };

  const approvalColors = {
    pending: 'warning',
    approved: 'success',
    rejected: 'error',
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data.events);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events');
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setError('');
    setSuccess('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      title: '',
      description: '',
      eventType: '',
      startDate: '',
      endDate: '',
      venue: '',
      maxParticipants: '',
      registrationDeadline: '',
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/events', formData);
      setSuccess('Event created successfully!');
      fetchEvents();
      setTimeout(() => {
        handleCloseDialog();
        setSuccess('');
      }, 1500);
    } catch (error) {
      console.error('Error creating event:', error);
      setError(error.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = (eventId) => {
    // Navigate to registration page
    navigate(`/events/${eventId}/register`);
  };

  const handleOpenDeleteDialog = (eventId, eventTitle) => {
    setDeleteDialog({ open: true, eventId, eventTitle });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false, eventId: null, eventTitle: '' });
  };

  const handleDeleteEvent = async () => {
    try {
      setLoading(true);
      await api.delete(`/events/${deleteDialog.eventId}`);
      setSuccess('Event deleted successfully!');
      fetchEvents();
      handleCloseDeleteDialog();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error deleting event:', error);
      setError(error.response?.data?.message || 'Failed to delete event');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <Navbar title="Events" />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4">Campus Events</Typography>
          {(user?.role === 'club_admin' || user?.role === 'college_admin') && (
            <Button
              variant="contained"
              startIcon={<AddCircleIcon />}
              onClick={handleOpenDialog}
            >
              Create Event
            </Button>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        <Grid container spacing={3}>
          {events.length === 0 ? (
            <Grid item xs={12}>
              <Card sx={{ textAlign: 'center', py: 6 }}>
                <EventIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No events found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.role === 'club_admin'
                    ? 'Create your first event to get started'
                    : 'Check back later for upcoming events'}
                </Typography>
              </Card>
            </Grid>
          ) : (
            events.map((event) => (
              <Grid item xs={12} md={6} lg={4} key={event._id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                      <Chip
                        label={event.eventType}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                      <Box display="flex" gap={0.5} flexDirection="column">
                        <Chip
                          label={event.status}
                          size="small"
                          color={statusColors[event.status]}
                          sx={{ textTransform: 'capitalize' }}
                        />
                        {(user?.role === 'club_admin' || user?.role === 'college_admin') && (
                          <Chip
                            label={event.approvalStatus || 'pending'}
                            size="small"
                            color={approvalColors[event.approvalStatus || 'pending']}
                            sx={{ textTransform: 'capitalize' }}
                          />
                        )}
                      </Box>
                    </Box>

                    <Typography variant="h6" gutterBottom>
                      {event.title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" paragraph>
                      {event.description.length > 100
                        ? `${event.description.substring(0, 100)}...`
                        : event.description}
                    </Typography>

                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <CalendarMonthIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(event.startDate)}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <LocationOnIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {event.venue}
                      </Typography>
                    </Box>

                    {event.maxParticipants && (
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <PeopleIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {event.participants?.length || 0} / {event.maxParticipants} registered
                        </Typography>
                      </Box>
                    )}

                    {event.club && (
                      <Typography variant="caption" color="primary" display="block" mt={2}>
                        Organized by: {event.club.name}
                      </Typography>
                    )}
                  </CardContent>

                  <CardActions sx={{ px: 2, pb: 2 }}>
                    {user?.role === 'student' && event.status === 'upcoming' && (
                      <Button
                        fullWidth
                        variant="contained"
                        size="small"
                        onClick={() => handleRegister(event._id)}
                        disabled={
                          event.participants?.includes(user.id) ||
                          (event.maxParticipants &&
                            event.participants?.length >= event.maxParticipants)
                        }
                      >
                        {event.participants?.includes(user.id)
                          ? 'Registered'
                          : 'Register Now'}
                      </Button>
                    )}
                    
                    {(user?.role === 'club_admin' && event.organizer?._id === user?.id) || user?.role === 'college_admin' ? (
                      <Box display="flex" gap={1} width="100%">
                        <Button 
                          fullWidth 
                          variant="outlined" 
                          size="small"
                        >
                          View Details
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleOpenDeleteDialog(event._id, event.title)}
                        >
                          Delete
                        </Button>
                      </Box>
                    ) : (
                      <Button fullWidth variant="outlined" size="small">
                        View Details
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

        {/* Create Event Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Create New Event</Typography>
              <IconButton onClick={handleCloseDialog}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>

          <form onSubmit={handleSubmit}>
            <DialogContent dividers>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {success}
                </Alert>
              )}

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Event Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Event Type"
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    required
                  >
                    {eventTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Venue"
                    name="venue"
                    value={formData.venue}
                    onChange={handleChange}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Start Date & Time"
                    name="startDate"
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      min: new Date().toISOString().slice(0, 16),
                    }}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="End Date & Time"
                    name="endDate"
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      min: formData.startDate || new Date().toISOString().slice(0, 16),
                    }}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Max Participants"
                    name="maxParticipants"
                    type="number"
                    value={formData.maxParticipants}
                    onChange={handleChange}
                    inputProps={{ min: 1 }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Registration Deadline"
                    name="registrationDeadline"
                    type="datetime-local"
                    value={formData.registrationDeadline}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      min: new Date().toISOString().slice(0, 16),
                      max: formData.startDate,
                    }}
                  />
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? 'Creating...' : 'Create Event'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialog.open}
          onClose={handleCloseDeleteDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Delete Event</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the event <strong>"{deleteDialog.eventTitle}"</strong>?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              This action cannot be undone. All registrations and event data will be permanently removed.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={handleCloseDeleteDialog} disabled={loading}>
              Cancel
            </Button>
            <Button
              onClick={handleDeleteEvent}
              variant="contained"
              color="error"
              disabled={loading}
              startIcon={<DeleteIcon />}
            >
              {loading ? 'Deleting...' : 'Delete Event'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default Events;
