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
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import api from '../../utils/api';

const FacultyDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalAssignments: 0,
    totalStudents: 0,
    pendingGrading: 0,
  });
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch assignments for this faculty member (department filtered)
      const assignmentsRes = await api.get('/assignments');
      const assignmentsData = assignmentsRes.data.assignments;
      setAssignments(assignmentsData);
      
      // Fetch students from faculty's department
      const studentsRes = await api.get('/users/students');
      const studentsCount = studentsRes.data.count || 0;
      
      const pendingCount = assignmentsData.reduce((acc, assignment) => {
        return acc + assignment.submissions.filter(s => s.status === 'submitted').length;
      }, 0);

      setStats({
        totalAssignments: assignmentsData.length,
        totalStudents: studentsCount,
        pendingGrading: pendingCount,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <>
      <Navbar title="Faculty Dashboard" />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Welcome, Prof. {user?.name}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Department: {user?.department?.name || 'Not Assigned'}
          </Typography>
        </Paper>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <AssignmentIcon color="primary" fontSize="large" />
                  <Box>
                    <Typography variant="h4">{stats.totalAssignments}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Assignments
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
                  <PeopleIcon color="success" fontSize="large" />
                  <Box>
                    <Typography variant="h4">{stats.totalStudents}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Students
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
                  <AssignmentIcon color="warning" fontSize="large" />
                  <Box>
                    <Typography variant="h4">{stats.pendingGrading}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pending Grading
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Your Assignments</Typography>
            <Button variant="contained">Create New Assignment</Button>
          </Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Submissions</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignments.map((assignment) => (
                <TableRow key={assignment._id}>
                  <TableCell>{assignment.title}</TableCell>
                  <TableCell>{assignment.subject}</TableCell>
                  <TableCell>{new Date(assignment.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>{assignment.submissions.length}</TableCell>
                  <TableCell>
                    <Button size="small">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Container>
    </>
  );
};

export default FacultyDashboard;
