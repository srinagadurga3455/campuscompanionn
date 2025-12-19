import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import {
  Container,
  Typography,
  Paper,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Avatar,
  IconButton,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DownloadIcon from '@mui/icons-material/Download';
import api from '../utils/api';

const Assignments = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await api.get('/assignments');
      setAssignments(response.data.assignments || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (url, filename) => {
    const link = document.createElement('a');
    link.href = `http://localhost:5000${url}`;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getMySubmission = (assignment) => {
    return assignment.submissions?.find(s => s.student?._id === user?.id || s.student === user?.id);
  };

  return (
    <>
      <Navbar title="Assignments" />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              sx={{
                width: 60,
                height: 60,
                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              }}
            >
              <AssignmentIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h4">My Assignments</Typography>
              <Typography variant="body2" color="text.secondary">
                Total: {assignments.length} assignments
              </Typography>
            </Box>
          </Box>
        </Paper>

        {loading ? (
          <Typography>Loading assignments...</Typography>
        ) : assignments.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <AssignmentIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No assignments available
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {assignments.map((assignment) => {
              const mySubmission = getMySubmission(assignment);
              const isPastDue = new Date(assignment.dueDate) < new Date();
              
              return (
                <Grid item xs={12} md={6} key={assignment._id}>
                  <Card>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {assignment.title}
                        </Typography>
                        {isPastDue ? (
                          <Chip label="Past Due" color="error" size="small" />
                        ) : (
                          <Chip label="Active" color="success" size="small" />
                        )}
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {assignment.description}
                      </Typography>

                      <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                        <Chip label={assignment.subject} size="small" color="primary" />
                        <Chip label={`Year ${assignment.year}`} size="small" />
                        <Chip label={`${assignment.maxMarks} marks`} size="small" color="info" />
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        📅 Due: {new Date(assignment.dueDate).toLocaleDateString()} at{' '}
                        {new Date(assignment.dueDate).toLocaleTimeString()}
                      </Typography>

                      {assignment.attachments && assignment.attachments.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          {assignment.attachments.map((attachment, index) => (
                            <Button
                              key={index}
                              variant="outlined"
                              size="small"
                              startIcon={<PictureAsPdfIcon />}
                              endIcon={<DownloadIcon />}
                              onClick={() => handleDownload(attachment.url, attachment.filename)}
                              sx={{ mr: 1 }}
                            >
                              {attachment.filename}
                            </Button>
                          ))}
                        </Box>
                      )}

                      {mySubmission && (
                        <Box sx={{ mt: 2, p: 2, bgcolor: 'success.light', borderRadius: 2 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.dark' }}>
                            ✓ Submitted on {new Date(mySubmission.submittedAt).toLocaleDateString()}
                          </Typography>
                          {mySubmission.status === 'graded' && (
                            <Typography variant="body2" sx={{ color: 'success.dark', mt: 1 }}>
                              Grade: {mySubmission.marksObtained}/{assignment.maxMarks}
                              {mySubmission.feedback && ` - ${mySubmission.feedback}`}
                            </Typography>
                          )}
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </>
  );
};

export default Assignments;
