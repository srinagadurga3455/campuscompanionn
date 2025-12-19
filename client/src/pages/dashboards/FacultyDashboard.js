import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalAssignments: 0,
    totalStudents: 0,
    pendingGrading: 0,
  });
  const [assignments, setAssignments] = useState([]);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch assignments for this faculty member
      const assignmentsRes = await api.get('/assignments');
      const assignmentsData = assignmentsRes.data.assignments;
      setAssignments(assignmentsData);

      // Fetch faculty's enrolled classes
      const enrollmentsRes = await api.get('/enrollments/my-classes');
      const enrollmentsData = enrollmentsRes.data.enrollments || [];

      // Group enrollments by subject and class details
      const classMap = new Map();

      enrollmentsData.forEach(enrollment => {
        const student = enrollment.student;
        const key = `${enrollment.subject}-${student.year || 'N/A'}-${student.branch?._id || 'N/A'}-${enrollment.classSection || 'N/A'}`;

        if (classMap.has(key)) {
          classMap.get(key).students.push(student);
        } else {
          classMap.set(key, {
            subject: enrollment.subject,
            year: student.year,
            branch: student.branch,
            section: enrollment.classSection,
            teacherCode: enrollment.teacherCode,
            students: [student]
          });
        }
      });

      const uniqueClasses = Array.from(classMap.values());
      setClasses(uniqueClasses);

      const pendingCount = assignmentsData.reduce((acc, assignment) => {
        return acc + assignment.submissions.filter(s => s.status === 'submitted').length;
      }, 0);

      setStats({
        totalAssignments: assignmentsData.length,
        totalStudents: enrollmentsData.length,
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
            Teacher Code: {user?.teacherCode || 'Not Assigned'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Branch: {user?.branch?.name || 'Not Assigned'}
          </Typography>
          <Box mt={2} display="flex" gap={2}>
            <Button
              variant="contained"
              onClick={() => navigate('/mark-attendance')}
              sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
            >
              📋 Mark Attendance
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/create-assignment')}
            >
              ➕ Create Assignment
            </Button>
          </Box>
        </Paper>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Card
              onClick={() => navigate('/assignments')}
              sx={{ cursor: 'pointer' }}
            >
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
            <Card
              onClick={() => navigate('/students')}
              sx={{ cursor: 'pointer' }}
            >
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
            <Card
              onClick={() => navigate('/pending-grades')}
              sx={{ cursor: 'pointer' }}
            >
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

        {/* Faculty Classes Section */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            My Classes
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Subject</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Branch</TableCell>
                <TableCell>Section</TableCell>
                <TableCell>Students</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {classes.length > 0 ? (
                classes.map((classItem, index) => (
                  <TableRow key={index}>
                    <TableCell>{classItem.subject}</TableCell>
                    <TableCell>{classItem.year || 'N/A'}</TableCell>
                    <TableCell>{classItem.branch?.name || 'N/A'}</TableCell>
                    <TableCell>{classItem.section || 'N/A'}</TableCell>
                    <TableCell>{classItem.students.length}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No students enrolled yet
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Your Assignments</Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/create-assignment')}
            >
              Create New Assignment
            </Button>
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
                  <TableCell>{assignment.submissions?.length || 0}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => navigate(`/assignment/${assignment._id}`)}
                    >
                      View Details
                    </Button>
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
