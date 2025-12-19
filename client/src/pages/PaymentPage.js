import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    CircularProgress,
    Card,
    CardContent,
    TextField,
    Alert,
    Step,
    Stepper,
    StepLabel,
    StepContent
} from '@mui/material';
import PaidIcon from '@mui/icons-material/Paid';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Navbar from '../components/Navbar';
import api from '../utils/api';

const PaymentPage = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [activeStep, setActiveStep] = useState(0);

    const fetchEventDetails = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/events/${eventId}`);
            setEvent(res.data.event);
        } catch (error) {
            setError('Failed to load event details');
            console.error('Error fetching event:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (eventId) {
            fetchEventDetails();
        }
    }, [eventId]);

    const handlePayment = () => {
        if (event?.paymentLink) {
            window.open(event.paymentLink, '_blank');
            setActiveStep(1); // Move to transaction step
        } else {
            setError('Payment link not available');
        }
    };

    const handleVerify = async () => {
        if (!transactionId.trim()) return;

        try {
            setVerifying(true);
            setError('');
            await api.post(`/events/${eventId}/verify-payment`, { transactionId });
            setActiveStep(2); // Success step
            setTimeout(() => {
                navigate('/events');
            }, 3000);
        } catch (error) {
            setError(error.response?.data?.message || 'Verification failed. Please try again.');
        } finally {
            setVerifying(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!event) {
        return (
            <Container maxWidth="sm" sx={{ mt: 8 }}>
                <Alert severity="error">Event not found</Alert>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/events')} sx={{ mt: 2 }}>
                    Back to Events
                </Button>
            </Container>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 8 }}>
            <Navbar title="Payment" />
            <Container maxWidth="md" sx={{ mt: { xs: 10, md: 12 }, pt: 2 }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: 'warning.main' }}>
                            Payment Required
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            To finalize your registration for <strong>{event.title}</strong>, please complete the payment below.
                            <br />
                            <Box component="span" sx={{ color: 'error.main', fontWeight: 'bold' }}>
                                You are not registered until payment is confirmed.
                            </Box>
                        </Typography>
                    </Box>

                    <Stepper activeStep={activeStep} orientation="vertical">
                        <Step>
                            <StepLabel error={!event.paymentLink}>
                                <Typography variant="h6">Make Payment</Typography>
                            </StepLabel>
                            <StepContent>
                                <Card variant="outlined" sx={{ mb: 3, bgcolor: 'background.paper' }}>
                                    <CardContent>
                                        <Typography variant="overline" display="block" color="text.secondary">
                                            Amount Due
                                        </Typography>
                                        <Typography variant="h3" color="primary.main" sx={{ fontWeight: 800, my: 1 }}>
                                            ₹{event.registrationFee}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Securely pay using Razorpay
                                        </Typography>
                                    </CardContent>
                                </Card>

                                <Button
                                    variant="contained"
                                    size="large"
                                    startIcon={<PaidIcon />}
                                    onClick={handlePayment}
                                    fullWidth
                                    sx={{
                                        py: 1.5,
                                        mb: 1,
                                        background: 'linear-gradient(45deg, #2563eb 30%, #4f46e5 90%)'
                                    }}
                                >
                                    Pay Now
                                </Button>
                                {event.paymentLink && (
                                    <Typography variant="caption" display="block" sx={{ mb: 2, color: 'text.secondary' }}>
                                        Link didn't open? <a href={event.paymentLink} target="_blank" rel="noopener noreferrer">Click here to pay</a>
                                    </Typography>
                                )}
                                <Button size="small" onClick={() => setActiveStep(1)} sx={{ mt: 1 }}>
                                    I have already paid
                                </Button>
                            </StepContent>
                        </Step>

                        <Step>
                            <StepLabel>
                                <Typography variant="h6">Confirm Transaction</Typography>
                            </StepLabel>
                            <StepContent>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    Please enter the Transaction ID / Reference Number from your payment confirmation.
                                </Typography>
                                <TextField
                                    fullWidth
                                    label="Transaction ID (e.g., pay_NCS...)"
                                    value={transactionId}
                                    onChange={(e) => setTransactionId(e.target.value)}
                                    sx={{ mb: 2 }}
                                    required
                                />
                                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                                <Box sx={{ mb: 2 }}>
                                    <Button
                                        variant="contained"
                                        onClick={handleVerify}
                                        disabled={verifying || !transactionId}
                                        startIcon={verifying && <CircularProgress size={20} />}
                                    >
                                        {verifying ? 'Verifying...' : 'Complete Registration'}
                                    </Button>
                                    <Button
                                        onClick={() => setActiveStep(0)}
                                        sx={{ mt: 1, ml: 1 }}
                                    >
                                        Back
                                    </Button>
                                </Box>
                            </StepContent>
                        </Step>

                        <Step>
                            <StepLabel>Registration Confirmed</StepLabel>
                            <StepContent>
                                <Alert severity="success" icon={<CheckCircleIcon fontSize="inherit" />}>
                                    Your payment has been verified and registration is complete! Redirecting to events...
                                </Alert>
                            </StepContent>
                        </Step>
                    </Stepper>
                </Paper>
            </Container>
        </Box>
    );
};

export default PaymentPage;
