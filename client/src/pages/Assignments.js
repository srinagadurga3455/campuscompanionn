import React from 'react';
import Navbar from '../components/Navbar';
import { Container, Typography } from '@mui/material';

const Assignments = () => {
  return (
    <>
      <Navbar title="Assignments" />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4">Assignments Page</Typography>
        <Typography>Coming soon...</Typography>
      </Container>
    </>
  );
};

export default Assignments;
