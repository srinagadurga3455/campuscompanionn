import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import {
  Container,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  Button,
  Alert,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import SearchIcon from '@mui/icons-material/Search';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import api from '../utils/api';

const Students = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [teacherCode, setTeacherCode] = useState(user?.teacherCode || '');
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = students.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.blockchainId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [searchTerm, students]);

  const fetchStudents = async () => {
    try {
      // Fetch enrolled students instead of all students
      const response = await api.get('/enrollments/my-classes');
      const enrollments = response.data.enrollments || [];
      const enrolledStudents = enrollments.map(e => ({
        ...e.student,
        subject: e.subject,
        classSection: e.classSection,
        enrolledAt: e.enrolledAt
      }));
      setStudents(enrolledStudents);
      setFilteredStudents(enrolledStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateTeacherCode = async () => {
    try {
      const response = await api.post('/users/generate-teacher-code');
      setTeacherCode(response.data.teacherCode);
      alert('Teacher code generated: ' + response.data.teacherCode);
    } catch (error) {
      console.error('Error generating teacher code:', error);
      alert('Failed to generate teacher code');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(teacherCode);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const getYearColor = (year) => {
    const colors = {
      1: 'primary',
      2: 'success',
      3: 'warning',
      4: 'error',
    };
    return colors[year] || 'default';
  };

  return (
    <>
      <Navbar title="My Students" />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Avatar
              sx={{
                width: 60,
                height: 60,
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              }}
            >
              <PeopleIcon fontSize="large" />
            </Avatar>
            <Box flex={1}>
              <Typography variant="h4">My Students</Typography>
              <Typography variant="body2" color="text.secondary">
                Department: {user?.department?.name || 'All Departments'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Enrolled Students: {filteredStudents.length}
              </Typography>
            </Box>
          </Box>

          {/* Teacher Code Section */}
          <Box sx={{ mt: 3, p: 2, bgcolor: 'primary.light', borderRadius: 2 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ color: 'primary.contrastText' }}>
              Your Teacher Code
            </Typography>
            {teacherCode ? (
              <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="h5" sx={{ fontFamily: 'monospace', color: 'primary.contrastText' }}>
                  {teacherCode}
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  onClick={copyToClipboard}
                  startIcon={<ContentCopyIcon />}
                  sx={{ bgcolor: 'white', color: 'primary.main' }}
                >
                  {copySuccess ? 'Copied!' : 'Copy'}
                </Button>
              </Box>
            ) : (
              <Button
                variant="contained"
                onClick={generateTeacherCode}
                sx={{ bgcolor: 'white', color: 'primary.main' }}
              >
                Generate Teacher Code
              </Button>
            )}
            {teacherCode && (
              <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'primary.contrastText' }}>
                Share this code with students so they can enroll in your class
              </Typography>
            )}
          </Box>

          <TextField
            fullWidth
            placeholder="Search by name, email, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mt: 2 }}
          />
        </Paper>

        <Paper sx={{ p: 3 }}>
          {loading ? (
            <Typography>Loading students...</Typography>
          ) : filteredStudents.length === 0 ? (
            <Box textAlign="center" py={4}>
              <PeopleIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No students found
              </Typography>
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Year</TableCell>
                  <TableCell>Enrolled On</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student._id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                        {student.blockchainId || 'Pending'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar sx={{ width: 32, height: 32 }}>
                          {student.name?.charAt(0).toUpperCase()}
                        </Avatar>
                        {student.name}
                      </Box>
                    </TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>
                      <Chip label={student.subject} color="primary" size="small" />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`Year ${student.year || 'N/A'}`}
                        color={getYearColor(student.year)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {student.enrolledAt ? new Date(student.enrolledAt).toLocaleDateString() : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Paper>
      </Container>
    </>
  );
};

export default Students;
