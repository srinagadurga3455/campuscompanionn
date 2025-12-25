import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Button,
  Chip,
  Avatar,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DownloadIcon from '@mui/icons-material/Download';
import api, { SERVER_URL } from '../utils/api';

const AssignmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignmentDetails();
  }, [id]);

  const fetchAssignmentDetails = async () => {
    try {
      const response = await api.get(`/assignments/${id}`);
      setAssignment(response.data.assignment);
    } catch (error) {
      console.error('Error fetching assignment details:', error);
      alert('Failed to load assignment details');
    } finally {
      setLoading(false);
    }
  };

  const getSubmissionStatus = (submission) => {
    if (submission.status === 'graded') {
      return { label: 'Graded', color: 'success' };
    } else if (submission.status === 'submitted') {
      return { label: 'Submitted', color: 'warning' };
    } else {
      return { label: 'Pending', color: 'default' };
    }
  };

  const handleDownload = (url, filename) => {
    const link = document.createElement('a');
    link.href = `${SERVER_URL}${url}`;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <>
        <Navbar title="Assignment Details" />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Typography>Loading...</Typography>
        </Container>
      </>
    );
  }

  if (!assignment) {
    return (
      <>
        <Navbar title="Assignment Details" />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Typography>Assignment not found</Typography>
        </Container>
      </>
    );
  }

  const gradedCount = assignment.submissions?.filter(s => s.status === 'graded').length || 0;
  const submittedCount = assignment.submissions?.filter(s => s.status === 'submitted').length || 0;
  const pendingCount = assignment.submissions?.filter(s => s.status === 'pending').length || 0;

  return (
    <>
      <Navbar title="Assignment Details" />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Avatar
              sx={{
                width: 60,
                height: 60,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              <AssignmentIcon fontSize="large" />
            </Avatar>
            <Box flex={1}>
              <Typography variant="h4">{assignment.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {assignment.subject} • Due: {new Date(assignment.dueDate).toLocaleDateString()}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              onClick={() => navigate('/dashboard/faculty')}
            >
              Back to Dashboard
            </Button>
          </Box>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {assignment.description}
          </Typography>

          <Box display="flex" gap={2} flexWrap="wrap">
            <Chip label={`Year ${assignment.year}`} color="primary" />
            <Chip label={`Total Marks: ${assignment.maxMarks}`} color="info" />
            <Chip label={`Department: ${assignment.department?.name || 'N/A'}`} />
          </Box>

          {assignment.attachments && assignment.attachments.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" gutterBottom>
                📎 Attachments:
              </Typography>
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
        </Paper>

        {/* Statistics */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: '#fff' }}>
              <CardContent>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  {gradedCount}
                </Typography>
                <Typography variant="body2">Graded</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: '#fff' }}>
              <CardContent>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  {submittedCount}
                </Typography>
                <Typography variant="body2">Awaiting Grading</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff' }}>
              <CardContent>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  {pendingCount}
                </Typography>
                <Typography variant="body2">Not Submitted</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Submissions Table */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Student Submissions
          </Typography>
          {assignment.submissions && assignment.submissions.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student</TableCell>
                  <TableCell>Student ID</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Submitted On</TableCell>
                  <TableCell>Marks</TableCell>
                  <TableCell>Feedback</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assignment.submissions.map((submission, index) => {
                  const status = getSubmissionStatus(submission);
                  return (
                    <TableRow key={index} hover>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar sx={{ width: 32, height: 32 }}>
                            {submission.student?.name?.charAt(0).toUpperCase()}
                          </Avatar>
                          {submission.student?.name || 'Unknown'}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {submission.student?.blockchainId || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={status.label} color={status.color} size="small" />
                      </TableCell>
                      <TableCell>
                        {submission.submittedAt
                          ? new Date(submission.submittedAt).toLocaleDateString()
                          : 'Not submitted'}
                      </TableCell>
                      <TableCell>
                        {submission.marksObtained !== undefined
                          ? `${submission.marksObtained}/${assignment.maxMarks}`
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {submission.feedback || '-'}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <Typography color="text.secondary">No submissions yet</Typography>
          )}
        </Paper>
      </Container>
    </>
  );
};

export default AssignmentDetails;
