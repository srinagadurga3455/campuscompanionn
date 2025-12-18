import React from 'react';
import Navbar from '../components/Navbar';
import { Container, Typography } from '@mui/material';

const Events = () => {
  return (
    <>
      <Navbar title="Events" />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4">Events Page</Typography>
        <Typography>Coming soon...</Typography>
      </Container>
    </>
  );
};

export default Events;
