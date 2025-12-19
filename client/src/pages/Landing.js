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
        sx={{
          pt: { xs: 12, md: 20 },
          pb: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: '1200px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(79,70,229,0.05) 0%, transparent 70%)',
            filter: 'blur(80px)',
            zIndex: 0
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
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
                animation: 'fadeIn 0.6s ease-out'
              }}
            >
              <VerifiedIcon sx={{ fontSize: 16, mr: 1 }} /> Verified Campus Ecosystem
            </Box>

            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '3rem', md: '5rem' },
                lineHeight: 1.1,
                mb: 3,
                className: 'animate-fade-in'
              }}
            >
              The Next Frontier Of <br />
              <Box component="span" sx={{ color: 'primary.main' }}>Campus Management</Box>
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary',
                maxWidth: '700px',
                mx: 'auto',
                mb: 5,
                fontWeight: 400,
                lineHeight: 1.6
              }}
            >
              Empower your institution with blockchain-verified credentials, precision tracking, and a unified digital hub for students and faculty.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
                sx={{ px: 4, py: 1.8, fontSize: '1rem', fontWeight: 700 }}
              >
                Join the Future
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/login')}
                sx={{ px: 4, py: 1.8, fontSize: '1rem', fontWeight: 600 }}
              >
                Launch App
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
      <Box sx={{ bgcolor: 'rgba(79,70,229,0.03)', py: 12, borderTop: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ mb: 3 }}>Ready to transform your campus?</Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 5, maxWidth: '600px', mx: 'auto' }}>
            Join hundreds of institutions already using Campus Companion to streamline their operations and secure their credentials.
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/register')}
            sx={{ px: 6, py: 2, borderRadius: '12px', fontWeight: 800 }}
          >
            Get Started Now
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;
