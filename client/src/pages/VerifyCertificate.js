import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Chip,
  Alert,
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import ErrorIcon from '@mui/icons-material/Error';
import api from '../utils/api';

const VerifyCertificate = () => {
  const { id } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyCertificate = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/certificates/verify/${id}`);
        setCertificate(response.data.certificate);
        setVerified(response.data.verified);
      } catch (error) {
        console.error('Error verifying certificate:', error);
        setError(error.response?.data?.message || 'Failed to verify certificate. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      verifyCertificate();
    } else {
      setError('No certificate ID provided. Please use a valid certificate verification link.');
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {error ? (
          <Box textAlign="center">
            <ErrorIcon sx={{ fontSize: 80, color: 'error.main' }} />
            <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
              Verification Failed
            </Typography>
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          </Box>
        ) : (
          <>
            <Box textAlign="center" mb={4}>
              <VerifiedIcon sx={{ fontSize: 80, color: verified ? 'success.main' : 'error.main' }} />
              <Typography variant="h4" gutterBottom>
                Certificate Verification
              </Typography>
              <Chip
                label={verified ? 'Verified' : 'Not Verified'}
                color={verified ? 'success' : 'error'}
                sx={{ mt: 2 }}
              />
            </Box>

            {certificate ? (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Certificate Details
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography><strong>Title:</strong> {certificate.title}</Typography>
                  <Typography><strong>Recipient:</strong> {certificate.recipient}</Typography>
                  <Typography><strong>Issued By:</strong> {certificate.issuer}</Typography>
                  <Typography><strong>Issued Date:</strong> {new Date(certificate.issuedDate).toLocaleDateString()}</Typography>
                  {certificate.blockchainTxHash && (
                    <Typography sx={{ mt: 2, wordBreak: 'break-all' }}>
                      <strong>Blockchain Transaction:</strong> {certificate.blockchainTxHash}
                    </Typography>
                  )}
                </Box>
              </Box>
            ) : (
              !error && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  Certificate not found with ID: {id}
                </Alert>
              )
            )}
          </>
        )}
      </Paper>
    </Container>
  );
};

export default VerifyCertificate;
