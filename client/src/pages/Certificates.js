import React from 'react';
import Navbar from '../components/Navbar';
import { Container, Typography } from '@mui/material';

const Certificates = () => {
  return (
    <>
      <Navbar title="My Certificates" />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4">Certificates Page</Typography>
        <Typography>Coming soon...</Typography>
      </Container>
    </>
  );
};

export default Certificates;
