import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import {
  Container,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  CircularProgress,
  Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PeopleIcon from '@mui/icons-material/People';
import DomainIcon from '@mui/icons-material/Domain';
import api from '../../utils/api';

const CollegeAdminDashboard = () => {
  const { user } = useAuth();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalClubs: 0,
    pendingVerifications: 0
  });
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [usersRes, statsRes] = await Promise.all([
        api.get('/college-admin/pending-users'),
        api.get('/college-admin/stats')
      ]);
      setPendingUsers(usersRes.data.users || []);
      setStats(statsRes.data.stats || {
        totalStudents: 0,
        totalFaculty: 0,
        totalClubs: 0,
        pendingVerifications: 0
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      showSnackbar('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await api.post(`/college-admin/approve-user/${userId}`);
      showSnackbar('User approved successfully');
      fetchDashboardData();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Approval failed', 'error');
    }
  };

  const handleRejectClick = (user) => {
    setSelectedUser(user);
    setOpenRejectDialog(true);
  };

  const handleRejectSubmit = async () => {
    if (!rejectionReason.trim()) return;
    try {
      await api.post(`/college-admin/reject-user/${selectedUser._id}`, { reason: rejectionReason });
      showSnackbar('User registration denied');
      setOpenRejectDialog(false);
      setRejectionReason('');
      fetchDashboardData();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Rejection failed', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 8 }}>
      <Navbar title="Administration Control" />

      <Container maxWidth="lg" sx={{ mt: { xs: 4, md: 6 } }}>
        <Box sx={{ mb: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.025em' }}>
            Institutional Administration
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Unified control for campus-wide verification and blockchain ecosystem management.
          </Typography>
        </Box>

        {/* Global Institutional Stats */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {[
            { label: 'Verified Students', value: stats.totalStudents, icon: <PeopleIcon />, color: '#6366f1' },
            { label: 'Academic Faculty', value: stats.totalFaculty, icon: <DomainIcon />, color: '#10b981' },
            { label: 'Active Clubs', value: stats.totalClubs, icon: <DomainIcon />, color: '#0ea5e9' },
            { label: 'Pending Queue', value: pendingUsers.length, icon: <PendingActionsIcon />, color: '#f43f5e' },
          ].map((stat, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: i === 3 && pendingUsers.length > 0 ? 'rgba(244, 63, 94, 0.3)' : 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2.5
                }}
              >
                <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'rgba(0,0,0,0.03)', color: stat.color }}>
                  {stat.icon}
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 900 }}>{stat.value}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.muted', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {stat.label}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Verification Queue Table */}
        <Paper sx={{ p: 4, borderRadius: '24px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <PendingActionsIcon sx={{ color: 'primary.main' }} />
              <Typography variant="h5" sx={{ fontWeight: 800 }}>Pending Verifications</Typography>
            </Box>
            <Chip
              label={`${pendingUsers.length} Requests`}
              sx={{ fontWeight: 800, bgcolor: 'primary.main', color: 'white', px: 1 }}
            />
          </Box>

          {loading ? (
            <Box sx={{ textAlign: 'center', py: 10 }}>
              <CircularProgress sx={{ mb: 2 }} />
              <Typography color="text.secondary">Fetching secure records...</Typography>
            </Box>
          ) : pendingUsers.length > 0 ? (
            <Box sx={{ overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ '& th': { borderBottom: '2px solid', borderColor: 'divider', color: 'text.muted', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' } }}>
                    <TableCell>Applicant Profile</TableCell>
                    <TableCell>Institutional Role</TableCell>
                    <TableCell>Branch / Dept</TableCell>
                    <TableCell align="right">Security Clearance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingUsers.map((pUser) => (
                    <TableRow key={pUser._id} sx={{ '& td': { py: 3, borderBottom: '1px solid', borderColor: 'rgba(0,0,0,0.05)' } }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                            {pUser.name.charAt(0)}
                          </Box>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{pUser.name}</Typography>
                            <Typography variant="caption" sx={{ color: 'text.muted' }}>{pUser.email}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={pUser.role.replace('_', ' ')}
                          size="small"
                          sx={{
                            textTransform: 'uppercase',
                            fontWeight: 900,
                            fontSize: '0.65rem',
                            bgcolor: 'rgba(0,0,0,0.05)',
                            color: 'text.primary'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{pUser.branch || 'General'}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            startIcon={<CheckCircleIcon />}
                            onClick={() => handleApprove(pUser._id)}
                            sx={{ fontWeight: 700 }}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleRejectClick(pUser)}
                            sx={{ fontWeight: 700 }}
                          >
                            Deny
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 12, bgcolor: 'rgba(0,0,0,1)', borderRadius: '16px', border: '1px dashed', borderColor: 'divider' }}>
              <CheckCircleIcon sx={{ fontSize: 48, color: 'text.muted', mb: 2, opacity: 0.2 }} />
              <Typography variant="body1" sx={{ color: 'text.muted', fontWeight: 600 }}>Queue cleared. All verified.</Typography>
            </Box>
          )}
        </Paper>

        {/* Action Dialogs */}
        <Dialog
          open={openRejectDialog}
          onClose={() => setOpenRejectDialog(false)}
          PaperProps={{ sx: { bgcolor: 'background.paper', borderRadius: '20px', p: 2 } }}
        >
          <DialogTitle sx={{ fontWeight: 800 }}>Deny Registration</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              Please provide a clear reason for denying access to <Box component="span" sx={{ color: 'text.primary', fontWeight: 700 }}>{selectedUser?.name}</Box>. This will be logged in the immutable security audit.
            </Typography>
            <TextField
              autoFocus
              fullWidth
              multiline
              rows={3}
              label="Rejection Reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Invalid institutional ID, Incorrect department..."
            />
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenRejectDialog(false)} sx={{ fontWeight: 700 }}>Cancel</Button>
            <Button
              onClick={handleRejectSubmit}
              variant="contained"
              color="error"
              disabled={!rejectionReason.trim()}
              sx={{ fontWeight: 700 }}
            >
              Confirm Denial
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ borderRadius: '12px', fontWeight: 700, border: '1px solid', boxShaow: 'lg' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default CollegeAdminDashboard;
