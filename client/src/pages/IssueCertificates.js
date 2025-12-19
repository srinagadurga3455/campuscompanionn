import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
    Container,
    Paper,
    Typography,
    Box,
    TextField,
    Button,
    Grid,
    Alert,
} from '@mui/material';
import api from '../utils/api';

const IssueCertificates = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [certificateFile, setCertificateFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [formData, setFormData] = useState({
        studentId: '',
        eventId: '',
        certificateType: '',
        description: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const submitData = new FormData();
            submitData.append('title', formData.certificateType);
            submitData.append('description', formData.description);
            submitData.append('recipient', formData.studentId);
            submitData.append('certificateType', formData.certificateType.toLowerCase());
            if (formData.eventId) {
                submitData.append('event', formData.eventId);
            }
            if (certificateFile) {
                submitData.append('certificateFile', certificateFile);
            }

            await api.post('/certificates', submitData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setSuccess('Certificate issued successfully!');
            setFormData({
                studentId: '',
                eventId: '',
                certificateType: '',
                description: ''
            });
            setCertificateFile(null);
            setFilePreview(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to issue certificate');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 8 }}>
            <Navbar title="Issue NFT Badges" />

            <Container maxWidth="md" sx={{ mt: { xs: 4, md: 6 } }}>
                <Paper sx={{ p: 4, borderRadius: '20px' }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                        Issue NFT Certificate/Badge
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
                        Issue blockchain-verified certificates and badges to students
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Student Blockchain ID"
                                    name="studentId"
                                    value={formData.studentId}
                                    onChange={handleChange}
                                    placeholder="e.g., 2301CSE0001"
                                    required
                                    helperText="Enter the student's blockchain ID"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Event ID (Optional)"
                                    name="eventId"
                                    value={formData.eventId}
                                    onChange={handleChange}
                                    helperText="Link this certificate to a specific event"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Certificate Type"
                                    name="certificateType"
                                    value={formData.certificateType}
                                    onChange={handleChange}
                                    placeholder="e.g., Participation, Winner, Achievement"
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
                                    placeholder="Describe the achievement or participation"
                                    required
                                />
                            </Grid>

                            <Grid item xs={12}>
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
                                        {loading ? 'Issuing...' : 'Issue Certificate'}
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

export default IssueCertificates;
