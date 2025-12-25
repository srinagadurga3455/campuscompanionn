import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Divider,
  Chip,
  IconButton,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import api from '../../utils/api';

const FacultyDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    pendingAssignments: 0,
    attendanceAverage: 0,
  });
  const [myClasses, setMyClasses] = useState([]);
  const [recentAssignments, setRecentAssignments] = useState([]);

  useEffect(() => {
    fetchFacultyData();
  }, [user?.id]);

  const fetchFacultyData = async () => {
    try {
      const classesRes = await api.get('/faculty/classes');
      const classes = classesRes.data.classes || [];
      setMyClasses(classes.slice(0, 5));

      const assignmentsRes = await api.get('/assignments');
      const assignments = assignmentsRes.data.assignments || [];
      const myAssignments = assignments.filter(a => a.faculty === user?.id);
      setRecentAssignments(myAssignments.slice(0, 5));

      setStats({
        totalClasses: classes.length,
        totalStudents: classes.reduce((acc, curr) => acc + (curr.students?.length || 0), 0),
        pendingAssignments: myAssignments.filter(a => a.status === 'active').length,
        attendanceAverage: 82.5, // Placeholder
      });
    } catch (error) {
      console.error('Error fetching faculty data:', error);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 8 }}>
      <Navbar title="Faculty Workspace" />

      <Container maxWidth="lg" sx={{ mt: { xs: 2, md: 4 } }}>
        {/* Workspace Header */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 5 },
            mb: 6,
            bgcolor: 'background.paper',
            borderRadius: '20px',
            border: '1px solid',
            borderColor: 'divider',
            position: 'relative'
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                <Box
                  sx={{
                    px: 1.2,
                    py: 0.4,
                    borderRadius: '6px',
                    bgcolor: 'primary.main',
                    color: 'white',
                    fontSize: '0.7rem',
                    fontWeight: 900,
                    textTransform: 'uppercase'
                  }}
                >
                  Faculty Portal Verified
                </Box>
                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>Academic Year 2024-25</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-0.025em' }}>
                Hello, Prof. {user?.name.split(' ').pop()}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, fontWeight: 500 }}>
                Manage your lectures, track student attendance, and evaluate coursework in a centralized digital environment.
              </Typography>

              <Stack direction="row" spacing={2.5}>
                <Button
                  variant="contained"
                  startIcon={<QrCodeScannerIcon />}
                  onClick={() => navigate('/mark-attendance')}
                  sx={{ px: 3, py: 1.2, fontWeight: 800, borderRadius: '12px' }}
                >
                  Launch Attendance
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/create-assignment')}
                  sx={{ px: 3, py: 1.2, fontWeight: 700, borderRadius: '12px', borderColor: 'divider' }}
                >
                  New Coursework
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        {/* Global Statistics */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {[
            { label: 'Active Classes', value: stats.totalClasses, icon: <AssignmentIcon />, color: '#6366f1' },
            { label: 'Total Mapped Students', value: stats.totalStudents, icon: <PeopleIcon />, color: '#10b981' },
            { label: 'Avg. Attendance', value: `${stats.attendanceAverage}%`, icon: <TrendingUpIcon />, color: '#0ea5e9' },
            { label: 'Pending Evaluations', value: stats.pendingAssignments, icon: <AssignmentIcon />, color: '#f59e0b' },
          ].map((stat, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: '12px',
                    bgcolor: '#f8fafc',
                    color: stat.color,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  {stat.icon}
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary' }}>{stat.value}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.muted', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {stat.label}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>Assigned Classes</Typography>
              <Button size="small" endIcon={<ArrowForwardIcon />} sx={{ fontWeight: 700 }}>Management Panel</Button>
            </Box>
            <Paper sx={{ p: 2, borderRadius: '20px', border: '1px solid', borderColor: 'divider' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ '& th': { borderBottom: '2px solid', borderColor: 'divider', textTransform: 'uppercase', fontSize: '0.7rem', fontWeight: 800, color: 'text.muted' } }}>
                    <TableCell>Course Code</TableCell>
                    <TableCell>Class Label</TableCell>
                    <TableCell>Capacity</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {myClasses.map((cls, i) => (
                    <TableRow key={i} sx={{ '&:last-child td': { border: 0 }, '& td': { fontWeight: 500, color: 'text.secondary' } }}>
                      <TableCell sx={{ color: 'primary.main', fontWeight: 800 }}>{cls.subjectCode || 'COMS102'}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>{cls.name}</TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{cls.students?.length || 0}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" sx={{ bgcolor: '#f8fafc', border: '1px solid', borderColor: 'divider' }}><ArrowForwardIcon sx={{ fontSize: 18 }} /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>Evaluations</Typography>
              <Button size="small" sx={{ fontWeight: 700 }}>Gradebook</Button>
            </Box>
            <Stack spacing={2}>
              {recentAssignments.map((assignment, i) => (
                <Card key={i} sx={{ borderRadius: '16px', border: '1px solid', borderColor: 'divider', transition: 'all 0.2s', '&:hover': { transform: 'scale(1.02)' } }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>{assignment.title}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip
                        label={`${assignment.submissions?.length || 0} Submissions`}
                        size="small"
                        sx={{ bgcolor: 'rgba(0,0,0,0.04)', fontWeight: 700, fontSize: '10px' }}
                      />
                      <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main' }}>
                        Active Record
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default FacultyDashboard;
