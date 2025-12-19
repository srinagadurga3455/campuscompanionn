import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import {
  Container,
  Grid,
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
  Tabs,
  Tab,
} from '@mui/material';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import api from '../../utils/api';

const CollegeAdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    pendingApprovals: 0,
    pendingEvents: 0,
    totalStudents: 0,
    totalFaculty: 0,
  });
  const [pendingUsers, setPendingUsers] = useState([]);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [rejectDialog, setRejectDialog] = useState({ open: false, userId: null, reason: '' });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const pendingRes = await api.get('/users/pending');
      setPendingUsers(pendingRes.data.users);
      setStats(prev => ({ ...prev, pendingApprovals: pendingRes.data.users.length }));

      // Get approved students count
      const studentsRes = await api.get('/users/students');
      const students = studentsRes.data.students || [];

      // Get all users to count faculty
      const allUsersRes = await api.get('/users');
      const allUsers = allUsersRes.data.users || [];
      const faculty = allUsers.filter(u => u.role === 'faculty' && u.approvalStatus === 'approved');

      // Get pending events
      const eventsRes = await api.get('/events');
      const allEvents = eventsRes.data.events || [];
      const pendingEventsData = allEvents.filter(e => e.approvalStatus === 'pending');
      setPendingEvents(pendingEventsData);

      setStats(prev => ({
        ...prev,
        totalStudents: students.length,
        totalFaculty: faculty.length,
        pendingEvents: pendingEventsData.length,
      }));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load dashboard data',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      setActionLoading(true);
      const user = pendingUsers.find(u => u._id === userId);
      await api.put(`/users/${userId}/approve`);

      const successMessage = user?.role === 'faculty'
        ? 'Faculty approved successfully! Teacher code has been generated.'
        : 'Student approved successfully! Blockchain ID will be generated.';

      setSnackbar({
        open: true,
        message: successMessage,
        severity: 'success'
      });
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error approving user:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to approve user',
        severity: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectDialog.reason.trim()) {
      setSnackbar({
        open: true,
        message: 'Please provide a reason for rejection',
        severity: 'warning'
      });
      return;
    }

    try {
      setActionLoading(true);
      await api.put(`/users/${rejectDialog.userId}/reject`, {
        reason: rejectDialog.reason,
      });
      setRejectDialog({ open: false, userId: null, reason: '' });
      setSnackbar({
        open: true,
        message: 'User rejected successfully',
        severity: 'success'
      });
      fetchDashboardData();
    } catch (error) {
      console.error('Error rejecting user:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to reject user',
        severity: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };
  const handleApproveEvent = async (eventId) => {
    try {
      setActionLoading(true);
      await api.put(`/events/${eventId}/approve`, { approvalStatus: 'approved' });
      setSnackbar({
        open: true,
        message: 'Event approved successfully! Notifications sent to all students.',
        severity: 'success'
      });
      fetchDashboardData();
    } catch (error) {
      console.error('Error approving event:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to approve event',
        severity: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectEvent = async (eventId) => {
    try {
      setActionLoading(true);
      await api.put(`/events/${eventId}/approve`, { approvalStatus: 'rejected' });
      setSnackbar({
        open: true,
        message: 'Event rejected successfully',
        severity: 'success'
      });
      fetchDashboardData();
    } catch (error) {
      console.error('Error rejecting event:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to reject event',
        severity: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };
  return (
    <>
      <Navbar title="College Admin Dashboard" />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress size={60} />
          </Box>
        ) : (
          <>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h4" gutterBottom>
                Welcome, {user?.name}!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                College Administration Panel
              </Typography>
            </Paper>

            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={3}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                      <PendingActionsIcon color="warning" fontSize="large" />
                      <Box>
                        <Typography variant="h4">{stats.pendingApprovals}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Pending Users
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                      <PendingActionsIcon color="info" fontSize="large" />
                      <Box>
                        <Typography variant="h4">{stats.pendingEvents}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Pending Events
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                      <CheckCircleIcon color="success" fontSize="large" />
                      <Box>
                        <Typography variant="h4">{stats.totalStudents}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Approved Students
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                      <CheckCircleIcon color="primary" fontSize="large" />
                      <Box>
                        <Typography variant="h4">{stats.totalFaculty}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Faculty Members
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Tabs for separating approvals */}
            <Paper sx={{ mb: 3 }}>
              <Tabs
                value={currentTab}
                onChange={(e, newValue) => setCurrentTab(newValue)}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
              >
                <Tab label={`User Approvals (${stats.pendingApprovals})`} />
                <Tab label={`Event Approvals (${pendingEvents.length})`} />
              </Tabs>
            </Paper>

            {/* User Approvals Tab */}
            {currentTab === 0 && (
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Pending User Approvals
                </Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Branch</TableCell>
                      <TableCell>Year</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pendingUsers.map((pendingUser) => (
                      <TableRow key={pendingUser._id}>
                        <TableCell>{pendingUser.name}</TableCell>
                        <TableCell>{pendingUser.email}</TableCell>
                        <TableCell>
                          <Chip
                            label={pendingUser.role.replace('_', ' ').toUpperCase()}
                            size="small"
                            color={
                              pendingUser.role === 'student' ? 'primary' :
                                pendingUser.role === 'faculty' ? 'success' :
                                  'secondary'
                            }
                          />
                        </TableCell>
                        <TableCell>
                          {pendingUser.branch?.name || pendingUser.branch?.code || 'N/A'}
                        </TableCell>
                        <TableCell>{pendingUser.year || 'N/A'}</TableCell>
                        <TableCell>
                          <Chip label="Pending" color="warning" size="small" />
                        </TableCell>
                        <TableCell>
                          <Box display="flex" gap={1}>
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              onClick={() => handleApprove(pendingUser._id)}
                              disabled={actionLoading}
                            >
                              Approve
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              onClick={() => setRejectDialog({ open: true, userId: pendingUser._id, reason: '' })}
                              disabled={actionLoading}
                            >
                              Reject
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                    {pendingUsers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                            No pending user approvals
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Paper>
            )}

            {/* Event Approvals Tab */}
            {currentTab === 1 && (
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Pending Event Approvals
                </Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Event Title</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Organizer</TableCell>
                      <TableCell>Start Date</TableCell>
                      <TableCell>Venue</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pendingEvents.map((event) => (
                      <TableRow key={event._id}>
                        <TableCell>{event.title}</TableCell>
                        <TableCell>
                          <Chip label={event.eventType} size="small" sx={{ textTransform: 'capitalize' }} />
                        </TableCell>
                        <TableCell>
                          {event.organizer?.name || 'Unknown'}
                          {event.club && ` (${event.club.name})`}
                        </TableCell>
                        <TableCell>
                          {new Date(event.startDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </TableCell>
                        <TableCell>{event.venue}</TableCell>
                        <TableCell>
                          <Box display="flex" gap={1}>
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              onClick={() => handleApproveEvent(event._id)}
                              disabled={actionLoading}
                            >
                              Approve
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              onClick={() => handleRejectEvent(event._id)}
                              disabled={actionLoading}
                            >
                              Reject
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                    {pendingEvents.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                            No pending event approvals
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Paper>
            )}
          </>
        )}
      </Container>

      {/* Reject Dialog */}
      <Dialog open={rejectDialog.open} onClose={() => setRejectDialog({ open: false, userId: null, reason: '' })}>
        <DialogTitle>Reject User Registration</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Reason for rejection *"
            value={rejectDialog.reason}
            onChange={(e) => setRejectDialog({ ...rejectDialog, reason: e.target.value })}
            margin="normal"
            required
            helperText="Please provide a detailed reason for rejecting this registration"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setRejectDialog({ open: false, userId: null, reason: '' })}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleReject}
            color="error"
            variant="contained"
            disabled={actionLoading || !rejectDialog.reason.trim()}
          >
            {actionLoading ? <CircularProgress size={20} /> : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CollegeAdminDashboard;

