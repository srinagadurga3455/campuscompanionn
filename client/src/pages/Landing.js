import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  Divider,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import EventIcon from '@mui/icons-material/Event';
import AssignmentIcon from '@mui/icons-material/Assignment';
import VerifiedIcon from '@mui/icons-material/Verified';
import BadgeIcon from '@mui/icons-material/Badge';
import SecurityIcon from '@mui/icons-material/Security';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Navbar from '../components/Navbar';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Blockchain IDs',
      description: 'Tamper-proof student identification and verified campus credentials.',
      icon: <VerifiedIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
    },
    {
      title: 'Smart Attendance',
      description: 'Precision geolocation-based attendance tracking for students and faculty.',
      icon: <SecurityIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
    },
    {
      title: 'Academic Hub',
      description: 'Seamlessly manage assignments, grades, and course materials in one place.',
      icon: <AssignmentIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
    },
    {
      title: 'NFT Badges',
      description: 'Recognize achievements with verifiable blockchain-based honor badges.',
      icon: <BadgeIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
    },
    {
      title: 'Event Management',
      description: 'Coordinate campus events, registrations, and club activities.',
      icon: <EventIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
    },
    {
      title: 'Unified Dashboard',
      description: 'Role-based control centers for students, faculty, and administration.',
      icon: <SchoolIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />

      {/* Hero Section */}
      <Box
        className="bg-image-overlay"
        sx={{
          pt: { xs: 2, md: 4 },
          pb: { xs: 8, md: 12 },
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          backgroundImage: 'url("/assets/university_campus.png")',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box
            className="glass-plate"
            sx={{
              p: { xs: 4, md: 8 },
              maxWidth: '800px',
              mx: 'auto',
              textAlign: 'center',
              animation: 'slideUp 0.8s ease-out'
            }}
          >
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                px: 2,
                py: 0.8,
                borderRadius: '99px',
                bgcolor: 'rgba(79,70,229,0.1)',
                border: '1px solid rgba(79,70,229,0.2)',
                color: 'primary.main',
                fontSize: '0.875rem',
                fontWeight: 600,
                mb: 4,
              }}
            >
              <VerifiedIcon sx={{ fontSize: 16, mr: 1 }} /> Verified Campus Ecosystem
            </Box>

            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '4.5rem' },
                fontWeight: 900,
                lineHeight: 1.1,
                mb: 3,
                letterSpacing: '-0.03em',
                color: 'text.primary'
              }}
            >
              The Next Frontier Of <br />
              <Box component="span" sx={{ color: 'primary.main' }}>Campus Management</Box>
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary',
                maxWidth: '600px',
                mx: 'auto',
                mb: 5,
                fontWeight: 500,
                lineHeight: 1.6,
                fontSize: { xs: '1rem', md: '1.25rem' }
              }}
            >
              Empower your institution with blockchain-verified credentials, precision tracking, and a unified digital hub for students and faculty.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
                sx={{
                  px: 5,
                  py: 2,
                  fontSize: '1rem',
                  fontWeight: 800,
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.4)'
                }}
              >
                Join the Future
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/login')}
                sx={{
                  px: 5,
                  py: 2,
                  fontSize: '1rem',
                  fontWeight: 700,
                  borderRadius: '12px',
                  borderWidth: '2px',
                  '&:hover': { borderWidth: '2px' }
                }}
              >
                Sign In
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ mb: 12 }}>
        <Box
          sx={{
            p: 4,
            borderRadius: '24px',
            bgcolor: '#ffffff',
            border: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-around',
            alignItems: 'center',
            gap: 4,
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)'
          }}
        >
          {[
            { label: 'Registered Students', value: '15,000+' },
            { label: 'Blockchain IDs', value: '12,400+' },
            { label: 'NFT Badges Issued', value: '8,500+' },
          ].map((stat, i) => (
            <Box key={i} sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 900, color: 'text.primary', mb: 0.5 }}>{stat.value}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{stat.label}</Typography>
            </Box>
          ))}
        </Box>
      </Container>

      {/* Features Grid */}
      <Container maxWidth="lg" sx={{ pb: 16 }}>
        <Box sx={{ mb: 8, textAlign: 'center' }}>
          <Typography variant="h2" sx={{ mb: 2 }}>Institutional Grade Features</Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400 }}>Everything you need to manage a modern campus at scale.</Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  p: 1,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': { borderColor: 'primary.main', bgcolor: '#f1f5f9' }
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 3 }}>{feature.icon}</Box>
                  <Typography variant="h5" sx={{ mb: 1.5, fontWeight: 700 }}>{feature.title}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer CTA */}
      <Box
        className="bg-image-overlay"
        sx={{
          backgroundImage: 'url("/assets/university_hall.png")',
          py: 16,
          borderTop: '1px solid',
          borderColor: 'divider',
          backgroundAttachment: 'scroll' // Hall looks better scrolled normally here
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Box className="glass-plate" sx={{ p: { xs: 4, md: 8 } }}>
            <Typography variant="h3" sx={{ mb: 3, fontWeight: 800 }}>Ready to transform your campus?</Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 5, maxWidth: '600px', mx: 'auto', fontWeight: 500 }}>
              Join hundreds of institutions already using Campus Companion to streamline their operations and secure their credentials.
            </Typography>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/register')}
              sx={{
                px: 6,
                py: 2.2,
                borderRadius: '12px',
                fontWeight: 800,
                boxShadow: '0 10px 20px -5px rgba(79, 70, 229, 0.4)'
              }}
            >
              Get Started Now
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;
