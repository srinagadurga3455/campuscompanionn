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
} from '@mui/material';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import api from '../../utils/api';

const CollegeAdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    pendingApprovals: 0,
    totalStudents: 0,
    totalFaculty: 0,
  });
  const [pendingUsers, setPendingUsers] = useState([]);
  const [rejectDialog, setRejectDialog] = useState({ open: false, userId: null, reason: '' });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const pendingRes = await api.get('/users/pending');
      setPendingUsers(pendingRes.data.users);
      setStats(prev => ({ ...prev, pendingApprovals: pendingRes.data.users.length }));

      const allUsersRes = await api.get('/users');
      const students = allUsersRes.data.users.filter(u => u.role === 'student' && u.approvalStatus === 'approved');
      const faculty = allUsersRes.data.users.filter(u => u.role === 'faculty');
      setStats(prev => ({
        ...prev,
        totalStudents: students.length,
        totalFaculty: faculty.length,
      }));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await api.put(`/users/${userId}/approve`);
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const handleReject = async () => {
    try {
      await api.put(`/users/${rejectDialog.userId}/reject`, {
        reason: rejectDialog.reason,
      });
      setRejectDialog({ open: false, userId: null, reason: '' });
      fetchDashboardData();
    } catch (error) {
      console.error('Error rejecting user:', error);
    }
  };

  return (
    <>
      <Navbar title="College Admin Dashboard" />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Welcome, {user?.name}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            College Administration Panel
          </Typography>
        </Paper>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <PendingActionsIcon color="warning" fontSize="large" />
                  <Box>
                    <Typography variant="h4">{stats.pendingApprovals}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pending Approvals
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
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
          <Grid item xs={12} sm={4}>
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

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Pending Approvals
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
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
                  <TableCell>{pendingUser.role}</TableCell>
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
                      >
                        Approve
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => setRejectDialog({ open: true, userId: pendingUser._id, reason: '' })}
                      >
                        Reject
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {pendingUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No pending approvals
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      </Container>

      {/* Reject Dialog */}
      <Dialog open={rejectDialog.open} onClose={() => setRejectDialog({ open: false, userId: null, reason: '' })}>
        <DialogTitle>Reject User Registration</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Reason for rejection"
            value={rejectDialog.reason}
            onChange={(e) => setRejectDialog({ ...rejectDialog, reason: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialog({ open: false, userId: null, reason: '' })}>
            Cancel
          </Button>
          <Button onClick={handleReject} color="error" variant="contained">
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CollegeAdminDashboard;
