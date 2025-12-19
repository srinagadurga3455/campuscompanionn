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
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import EventIcon from '@mui/icons-material/Event';
import AssignmentIcon from '@mui/icons-material/Assignment';
import VerifiedIcon from '@mui/icons-material/Verified';
import BadgeIcon from '@mui/icons-material/Badge';
import SecurityIcon from '@mui/icons-material/Security';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <SchoolIcon sx={{ fontSize: 48, color: '#667eea' }} />,
      title: 'Multi-Role Dashboards',
      description: 'Customized dashboards for Students, Faculty, Club Admins, and College Admins',
    },
    {
      icon: <EventIcon sx={{ fontSize: 48, color: '#764ba2' }} />,
      title: 'Event Management',
      description: 'Create, manage, and participate in campus events with ease',
    },
    {
      icon: <AssignmentIcon sx={{ fontSize: 48, color: '#00bcd4' }} />,
      title: 'Assignment Tracking',
      description: 'Submit and manage assignments with deadline notifications',
    },
    {
      icon: <VerifiedIcon sx={{ fontSize: 48, color: '#4caf50' }} />,
      title: 'Blockchain Certificates',
      description: 'Tamper-proof NFT-based certificates on blockchain',
    },
    {
      icon: <BadgeIcon sx={{ fontSize: 48, color: '#ff9800' }} />,
      title: 'Digital Student ID',
      description: 'Blockchain-based student IDs with unique format (YYCCAAxxxx)',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 48, color: '#f44336' }} />,
      title: 'Secure Verification',
      description: 'Public verification system for all credentials and certificates',
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
        animation: 'gradientShift 15s ease infinite',
        '@keyframes gradientShift': {
          '0%, 100%': {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          },
          '50%': {
            background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
          },
        },
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: { xs: '300px', sm: '450px', md: '600px' },
          height: { xs: '300px', sm: '450px', md: '600px' },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)',
          filter: 'blur(100px)',
          animation: 'float 20s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
            '50%': { transform: 'translate(-80px, 80px) scale(1.1)' },
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: { xs: '250px', sm: '400px', md: '500px' },
          height: { xs: '250px', sm: '400px', md: '500px' },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.03) 100%)',
          filter: 'blur(90px)',
          animation: 'float 25s ease-in-out infinite reverse',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: { xs: '200px', sm: '280px', md: '350px' },
          height: { xs: '200px', sm: '280px', md: '350px' },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          filter: 'blur(70px)',
          animation: 'pulse 10s ease-in-out infinite',
          '@keyframes pulse': {
            '0%, 100%': { transform: 'translate(-50%, -50%) scale(1)', opacity: 0.3 },
            '50%': { transform: 'translate(-50%, -50%) scale(1.3)', opacity: 0.5 },
          },
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ 
          py: { xs: 2, md: 3 },
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 },
          animation: 'fadeInDown 0.8s ease-out',
          '@keyframes fadeInDown': {
            from: { opacity: 0, transform: 'translateY(-20px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
          },
        }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              textShadow: '0 4px 20px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)',
              letterSpacing: '0.5px',
            }}
          >
            <SchoolIcon sx={{ fontSize: { xs: 28, sm: 36 }, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' }} /> Campus Companion
          </Typography>
          <Stack direction="row" spacing={{ xs: 1.5, sm: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/login')}
              sx={{
                color: '#ffffff',
                borderColor: '#ffffff',
                borderWidth: 2.5,
                fontWeight: 700,
                px: { xs: 2.5, sm: 3.5 },
                py: { xs: 0.75, sm: 1 },
                fontSize: { xs: '0.875rem', sm: '1rem' },
                letterSpacing: '0.5px',
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                '&:hover': {
                  borderColor: '#ffffff',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderWidth: 2.5,
                  transform: 'translateY(-3px)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              Login
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/register')}
              sx={{
                backgroundColor: '#ffffff',
                color: '#5568ea',
                fontWeight: 700,
                px: { xs: 2.5, sm: 3.5 },
                py: { xs: 0.75, sm: 1 },
                fontSize: { xs: '0.875rem', sm: '1rem' },
                letterSpacing: '0.5px',
                boxShadow: '0 6px 24px rgba(0,0,0,0.35)',
                '&:hover': {
                  backgroundColor: '#f8f9ff',
                  color: '#4556d8',
                  transform: 'translateY(-3px) scale(1.02)',
                  boxShadow: '0 10px 32px rgba(0,0,0,0.4)',
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              Get Started
            </Button>
          </Stack>
        </Box>

        {/* Hero Section */}
        <Box sx={{ 
          textAlign: 'center', 
          py: { xs: 6, md: 10 },
          animation: 'fadeIn 1s ease-out 0.2s both',
          '@keyframes fadeIn': {
            from: { opacity: 0 },
            to: { opacity: 1 },
          },
        }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.25rem', sm: '3.5rem', md: '4.5rem', lg: '5.5rem' },
              fontWeight: 900,
              color: '#ffffff',
              mb: { xs: 2, md: 3 },
              px: { xs: 2, sm: 0 },
              textShadow: '0 8px 40px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              background: 'linear-gradient(to bottom, #ffffff 0%, #f0f0ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'slideInUp 1s ease-out, glow 3s ease-in-out infinite',
              '@keyframes slideInUp': {
                from: {
                  opacity: 0,
                  transform: 'translateY(40px)',
                },
                to: {
                  opacity: 1,
                  transform: 'translateY(0)',
                },
              },
              '@keyframes glow': {
                '0%, 100%': { filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.3))' },
                '50%': { filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.5))' },
              },
            }}
          >
            Your Campus, Simplified
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: '#f5f5ff',
              mb: { xs: 4, md: 5 },
              maxWidth: '750px',
              mx: 'auto',
              px: { xs: 2, sm: 3 },
              fontWeight: 500,
              fontSize: { xs: '1rem', sm: '1.15rem', md: '1.35rem' },
              lineHeight: 1.6,
              textShadow: '0 4px 20px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)',
              animation: 'slideInUp 1s ease-out 0.2s both',
            }}
          >
            A unified platform combining MERN Stack with Web3 Blockchain for managing
            schedules, assignments, events, and secure student identification
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
            sx={{ mb: 6 }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                backgroundColor: '#ffffff',
                color: '#5568ea',
                px: { xs: 3.5, sm: 4.5, md: 5 },
                py: { xs: 1.5, md: 2 },
                fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' },
                fontWeight: 700,
                borderRadius: '12px',
                letterSpacing: '0.5px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.4), 0 5px 15px rgba(255,255,255,0.2)',
                animation: 'buttonPulse 2s ease-in-out infinite',
                '@keyframes buttonPulse': {
                  '0%, 100%': { boxShadow: '0 10px 40px rgba(0,0,0,0.4), 0 5px 15px rgba(255,255,255,0.2)' },
                  '50%': { boxShadow: '0 15px 50px rgba(0,0,0,0.5), 0 8px 20px rgba(255,255,255,0.3)' },
                },
                '&:hover': {
                  backgroundColor: '#f8f9ff',
                  color: '#4556d8',
                  transform: 'translateY(-6px) scale(1.05)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 10px 25px rgba(255,255,255,0.3)',
                },
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              Join Now
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/login')}
              sx={{
                color: '#ffffff',
                borderColor: '#ffffff',
                borderWidth: 3,
                px: { xs: 3.5, sm: 4.5, md: 5 },
                py: { xs: 1.5, md: 2 },
                fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' },
                fontWeight: 700,
                borderRadius: '12px',
                letterSpacing: '0.5px',
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                '&:hover': {
                  borderColor: '#ffffff',
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  borderWidth: 3,
                  transform: 'translateY(-6px) scale(1.05)',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.4)',
                },
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              Sign In
            </Button>
          </Stack>

          {/* Stats */}
          <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid item xs={12} sm={4}>
              <Box sx={{
                animation: 'scaleIn 0.6s ease-out 0.4s both',
                '@keyframes scaleIn': {
                  from: { opacity: 0, transform: 'scale(0.8)' },
                  to: { opacity: 1, transform: 'scale(1)' },
                },
              }}>
                <Typography variant="h2" sx={{ 
                  color: '#ffffff', 
                  fontWeight: 900, 
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                  textShadow: '0 4px 30px rgba(0,0,0,0.5), 0 2px 15px rgba(0,0,0,0.3)',
                  mb: 1,
                }}>
                  Web3
                </Typography>
                <Typography sx={{ 
                  color: '#f5f5ff', 
                  fontWeight: 600,
                  fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' },
                  textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                }}>
                  Blockchain Integration
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{
                animation: 'scaleIn 0.6s ease-out 0.5s both',
              }}>
                <Typography variant="h2" sx={{ 
                  color: '#ffffff', 
                  fontWeight: 900, 
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                  textShadow: '0 4px 30px rgba(0,0,0,0.5), 0 2px 15px rgba(0,0,0,0.3)',
                  mb: 1,
                }}>
                  MERN
                </Typography>
                <Typography sx={{ 
                  color: '#f5f5ff', 
                  fontWeight: 600,
                  fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' },
                  textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                }}>
                  Full Stack Platform
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{
                animation: 'scaleIn 0.6s ease-out 0.6s both',
              }}>
                <Typography variant="h2" sx={{ 
                  color: '#ffffff', 
                  fontWeight: 900, 
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                  textShadow: '0 4px 30px rgba(0,0,0,0.5), 0 2px 15px rgba(0,0,0,0.3)',
                  mb: 1,
                }}>
                  NFT
                </Typography>
                <Typography sx={{ 
                  color: '#f5f5ff', 
                  fontWeight: 600,
                  fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' },
                  textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                }}>
                  Digital Certificates
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Features Section */}
        <Box sx={{ py: 8 }}>
          <Typography
            variant="h2"
            sx={{
              textAlign: 'center',
              color: '#ffffff',
              mb: 2,
              px: { xs: 2, sm: 0 },
              fontWeight: 900,
              fontSize: { xs: '2rem', sm: '2.75rem', md: '3.5rem' },
              textShadow: '0 6px 30px rgba(0,0,0,0.4), 0 3px 12px rgba(0,0,0,0.3)',
              letterSpacing: '-0.01em',
            }}
          >
            Everything You Need
          </Typography>
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              color: '#f5f5ff',
              mb: { xs: 4, md: 6 },
              px: { xs: 2, sm: 0 },
              fontWeight: 400,
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.15rem' },
              textShadow: '0 2px 10px rgba(0,0,0,0.3)',
            }}
          >
            Powerful features to transform your campus experience
          </Typography>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.95) 100%)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '20px',
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: '2px solid rgba(255, 255, 255, 0.5)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                    '@keyframes fadeInUp': {
                      from: {
                        opacity: 0,
                        transform: 'translateY(40px)',
                      },
                      to: {
                        opacity: 1,
                        transform: 'translateY(0)',
                      },
                    },
                    '&:hover': {
                      transform: 'translateY(-16px) scale(1.03)',
                      boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
                      background: 'linear-gradient(145deg, rgba(255,255,255,1) 0%, rgba(248,249,255,1) 100%)',
                      border: '2px solid rgba(102, 126, 234, 0.5)',
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 4 }}>
                    <Box sx={{ 
                      mb: 3,
                      display: 'inline-block',
                      p: 2,
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)',
                      transition: 'all 0.4s ease',
                      '&:hover': {
                        transform: 'scale(1.15) rotate(8deg)',
                        background: 'linear-gradient(135deg, rgba(102,126,234,0.2) 0%, rgba(118,75,162,0.2) 100%)',
                      },
                    }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" gutterBottom sx={{ 
                      fontWeight: 700, 
                      color: '#1a202c',
                      mb: 2,
                      letterSpacing: '-0.01em',
                    }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ 
                      lineHeight: 1.7,
                      fontSize: '1rem',
                      color: '#4a5568',
                    }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* CTA Section */}
        <Box sx={{ 
          textAlign: 'center', 
          py: { xs: 6, md: 10 }, 
          pb: { xs: 8, md: 14 },
          animation: 'fadeIn 1s ease-out 0.8s both',
        }}>
          <Typography variant="h2" sx={{ 
            color: '#ffffff', 
            mb: { xs: 2, md: 3 },
            px: { xs: 2, sm: 0 },
            fontWeight: 900,
            fontSize: { xs: '2rem', sm: '2.75rem', md: '3.5rem' },
            textShadow: '0 6px 30px rgba(0,0,0,0.5), 0 3px 15px rgba(0,0,0,0.3)',
            letterSpacing: '-0.01em',
          }}>
            Ready to Get Started?
          </Typography>
          <Typography
            variant="h5"
            sx={{ 
              color: '#f5f5ff', 
              mb: { xs: 4, md: 6 },
              px: { xs: 2, sm: 3 },
              fontWeight: 500,
              fontSize: { xs: '1rem', sm: '1.2rem', md: '1.3rem' },
              maxWidth: '600px',
              mx: 'auto',
              textShadow: '0 3px 15px rgba(0,0,0,0.4)',
            }}
          >
            Join thousands of students and faculty managing campus life seamlessly
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
            sx={{
              backgroundColor: '#ffffff',
              color: '#5568ea',
              px: { xs: 5, sm: 7, md: 8 },
              py: { xs: 2, md: 2.5 },
              fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.35rem' },
              fontWeight: 800,
              borderRadius: '60px',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              boxShadow: '0 12px 48px rgba(0,0,0,0.4), 0 6px 20px rgba(255,255,255,0.3)',
              animation: 'ctaPulse 2.5s ease-in-out infinite',
              '@keyframes ctaPulse': {
                '0%, 100%': { 
                  transform: 'scale(1)',
                  boxShadow: '0 12px 48px rgba(0,0,0,0.4), 0 6px 20px rgba(255,255,255,0.3)'
                },
                '50%': { 
                  transform: 'scale(1.05)',
                  boxShadow: '0 16px 60px rgba(0,0,0,0.5), 0 8px 30px rgba(255,255,255,0.4)'
                },
              },
              '&:hover': {
                backgroundColor: '#f8f9ff',
                color: '#4556d8',
                transform: 'scale(1.1) translateY(-4px)',
                boxShadow: '0 20px 70px rgba(0,0,0,0.6), 0 10px 35px rgba(255,255,255,0.5)',
              },
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            Create Your Account
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Landing;
