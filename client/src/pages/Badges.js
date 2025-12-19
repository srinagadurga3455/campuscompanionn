import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Avatar,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import api from '../utils/api';

const Badges = () => {
  const { user } = useAuth();
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      const response = await api.get('/badges');
      setBadges(response.data.badges || []);
    } catch (error) {
      console.error('Error fetching badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeColor = (type) => {
    const colors = {
      gold: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
      silver: 'linear-gradient(135deg, #C0C0C0 0%, #808080 100%)',
      bronze: 'linear-gradient(135deg, #CD7F32 0%, #8B4513 100%)',
      default: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    };
    return colors[type] || colors.default;
  };

  return (
    <>
      <Navbar title="My Badges" />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Avatar
              sx={{
                width: 60,
                height: 60,
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              }}
            >
              <EmojiEventsIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h4">My Badges</Typography>
              <Typography variant="body2" color="text.secondary">
                Total Badges Earned: {badges.length}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {loading ? (
          <Typography>Loading badges...</Typography>
        ) : badges.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <EmojiEventsIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No badges earned yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Participate in events and activities to earn badges!
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {badges.map((badge) => (
              <Grid item xs={12} sm={6} md={4} key={badge._id}>
                <Card
                  sx={{
                    background: getBadgeColor(badge.badgeType),
                    color: '#fff',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  <CardContent>
                    <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                      <Avatar
                        sx={{
                          width: 80,
                          height: 80,
                          mb: 2,
                          background: 'rgba(255, 255, 255, 0.3)',
                          backdropFilter: 'blur(10px)',
                        }}
                      >
                        <EmojiEventsIcon fontSize="large" />
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                        {badge.badgeName}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                        {badge.description}
                      </Typography>
                      <Chip
                        label={badge.badgeType?.toUpperCase() || 'BADGE'}
                        size="small"
                        sx={{
                          background: 'rgba(255, 255, 255, 0.3)',
                          color: '#fff',
                          fontWeight: 600,
                          mb: 1,
                        }}
                      />
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        Earned on {new Date(badge.issuedDate).toLocaleDateString()}
                      </Typography>
                      {badge.tokenId && (
                        <Typography variant="caption" sx={{ opacity: 0.7, mt: 1 }}>
                          Token ID: {badge.tokenId}
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
};

export default Badges;
