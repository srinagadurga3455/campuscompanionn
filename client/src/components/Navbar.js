import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Divider,
  useTheme,
  useMediaQuery,
  Chip,
  Stack,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = ({ title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    handleClose();
    await logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'student': return '/dashboard';
      case 'faculty': return '/faculty-dashboard';
      case 'college_admin': return '/college-dashboard';
      case 'club_admin': return '/club-dashboard';
      default: return '/';
    }
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'all 0.2s ease',
              '&:hover': { opacity: 0.8 }
            }}
          >
            <SchoolIcon sx={{ color: 'primary.main', fontSize: 28 }} />
            <Typography
              variant="h6"
              sx={{
                ml: 1,
                fontWeight: 900,
                letterSpacing: '-0.03em',
                fontFamily: 'Outfit',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              CAMPUS<Box component="span" sx={{ color: 'primary.main' }}>COMPANION</Box>
            </Typography>
          </Box>
          {title && (
            <>
              <Divider orientation="vertical" flexItem sx={{ mx: 2, height: 24, alignSelf: 'center' }} />
              <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.secondary', display: { xs: 'none', sm: 'block' } }}>
                {title}
              </Typography>
            </>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {user ? (
            <>
              <Button
                component={RouterLink}
                to={getDashboardPath()}
                startIcon={<DashboardIcon />}
                variant="outlined"
                sx={{ display: { xs: 'none', md: 'flex' }, borderColor: 'divider', color: 'text.secondary' }}
              >
                Dashboard
              </Button>
              <Tooltip title="Account settings">
                <IconButton
                  onClick={handleMenu}
                  sx={{
                    p: 0.5,
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': { borderColor: 'primary.main' }
                  }}
                >
                  <Avatar
                    sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '14px', fontWeight: 800 }}
                  >
                    {user.name?.charAt(0)}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    mt: 1.5,
                    minWidth: 200,
                    borderRadius: '12px',
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  },
                }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }}>{user.name}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>{user.email}</Typography>
                  <Chip
                    label={user.role.replace('_', ' ')}
                    size="small"
                    sx={{ mt: 1, height: 20, fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', bgcolor: 'primary.main', color: 'white' }}
                  />
                </Box>
                <Divider />
                <MenuItem onClick={() => navigate(getDashboardPath())} sx={{ py: 1.2, gap: 1.5 }}>
                  <DashboardIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Command Center</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{ py: 1.2, gap: 1.5, color: 'error.main' }}>
                  <LogoutIcon sx={{ fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>End Session</Typography>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Stack direction="row" spacing={1.5}>
              <Button component={RouterLink} to="/login" variant="text" sx={{ fontWeight: 600 }}>
                Sign In
              </Button>
              <Button component={RouterLink} to="/register" variant="contained" sx={{ fontWeight: 700 }}>
                Get Started
              </Button>
            </Stack>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
