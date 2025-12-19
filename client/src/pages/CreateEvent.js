import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import {
    Container,
    Paper,
    Typography,
    Box,
    TextField,
    Button,
    MenuItem,
    Grid,
    Alert,
} from '@mui/material';
import api from '../utils/api';

const eventTypes = [
    'workshop',
    'seminar',
    'competition',
    'cultural',
    'sports',
    'technical',
    'other'
];

const CreateEvent = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        eventType: '',
        startDate: '',
        endDate: '',
        venue: '',
        maxParticipants: '',
        registrationDeadline: '',
        participationType: 'individual',
        minTeamSize: 1,
        maxTeamSize: 1,
        registrationFee: 0,
        paymentLink: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await api.post('/events', {
                ...formData,
                organizer: user._id,
                maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : undefined,
                teamSize: formData.participationType === 'team' ? {
                    min: parseInt(formData.minTeamSize),
                    max: parseInt(formData.maxTeamSize)
                } : undefined,
                registrationFee: parseInt(formData.registrationFee) || 0,
                paymentLink: formData.paymentLink
            });

            setSuccess('Event created successfully!');
            setTimeout(() => {
                navigate('/events');
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create event');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 8 }}>
            <Navbar title="Create Event" />

            <Container maxWidth="md" sx={{ mt: { xs: 4, md: 6 } }}>
                <Paper sx={{ p: 4, borderRadius: '20px' }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                        Create New Event
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
                        Fill in the details to create a new campus event
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
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
                                    multiline
                                    rows={4}
                                    label="Description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
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
                                        <MenuItem key={type} value={type}>
                                            {type.charAt(0).toUpperCase() + type.slice(1)}
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
                                    select
                                    label="Participation Type"
                                    name="participationType"
                                    value={formData.participationType}
                                    onChange={handleChange}
                                    required
                                >
                                    <MenuItem value="individual">Individual</MenuItem>
                                    <MenuItem value="team">Team</MenuItem>
                                </TextField>
                            </Grid>

                            {formData.participationType === 'team' && (
                                <>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            label="Min Team Size"
                                            name="minTeamSize"
                                            value={formData.minTeamSize}
                                            onChange={handleChange}
                                            required
                                            inputProps={{ min: 1 }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            label="Max Team Size"
                                            name="maxTeamSize"
                                            value={formData.maxTeamSize}
                                            onChange={handleChange}
                                            required
                                            inputProps={{ min: 1 }}
                                        />
                                    </Grid>
                                </>
                            )}

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Registration Fee per Person (0 for Free)"
                                    name="registrationFee"
                                    value={formData.registrationFee}
                                    onChange={handleChange}
                                    inputProps={{ min: 0 }}
                                />
                            </Grid>

                            {formData.registrationFee > 0 && (
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Razorpay Payment Link (e.g. razorpay.me/@yourclub)"
                                        name="paymentLink"
                                        value={formData.paymentLink}
                                        onChange={handleChange}
                                        required
                                        helperText="Students will be redirected here to pay after registration"
                                    />
                                </Grid>
                            )}

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    type="datetime-local"
                                    label="Start Date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    InputLabelProps={{ shrink: true }}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    type="datetime-local"
                                    label="End Date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    InputLabelProps={{ shrink: true }}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Max Participants"
                                    name="maxParticipants"
                                    value={formData.maxParticipants}
                                    onChange={handleChange}
                                    helperText="Leave empty for unlimited"
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    type="datetime-local"
                                    label="Registration Deadline"
                                    name="registrationDeadline"
                                    value={formData.registrationDeadline}
                                    onChange={handleChange}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => navigate('/club-dashboard')}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={loading}
                                    >
                                        {loading ? 'Creating...' : 'Create Event'}
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Container>
        </Box>
    );
};

export default CreateEvent;
