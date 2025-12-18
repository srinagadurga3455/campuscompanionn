import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Chip,
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import api from '../utils/api';

const VerifyCertificate = () => {
  const { id } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    verifyCertificate();
  }, [id]);

  const verifyCertificate = async () => {
    try {
      const response = await api.get(`/certificates/verify/${id}`);
      setCertificate(response.data.certificate);
      setVerified(response.data.verified);
    } catch (error) {
      console.error('Error verifying certificate:', error);
    } finally {
      setLoading(false);
    }
  };

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

        {certificate && (
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
        )}
      </Paper>
    </Container>
  );
};

export default VerifyCertificate;
