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
  Button,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import GradingIcon from '@mui/icons-material/Grading';
import api from '../utils/api';

const PendingGrades = () => {
  const { user } = useAuth();
  const [pendingSubmissions, setPendingSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gradeDialog, setGradeDialog] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [marks, setMarks] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetchPendingGrades();
  }, []);

  const fetchPendingGrades = async () => {
    try {
      const response = await api.get('/assignments');
      const assignments = response.data.assignments || [];
      
      // Extract all pending submissions from all assignments
      const pending = [];
      assignments.forEach((assignment) => {
        assignment.submissions.forEach((submission) => {
          if (submission.status === 'submitted') {
            pending.push({
              ...submission,
              assignmentTitle: assignment.title,
              assignmentId: assignment._id,
              subject: assignment.subject,
              totalMarks: assignment.maxMarks,
            });
          }
        });
      });
      
      setPendingSubmissions(pending);
    } catch (error) {
      console.error('Error fetching pending grades:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenGradeDialog = (submission) => {
    setSelectedSubmission(submission);
    setMarks('');
    setFeedback('');
    setGradeDialog(true);
  };

  const handleCloseGradeDialog = () => {
    setGradeDialog(false);
    setSelectedSubmission(null);
    setMarks('');
    setFeedback('');
  };

  const handleGradeSubmission = async () => {
    if (!selectedSubmission || !marks) return;

    try {
      await api.put(`/assignments/${selectedSubmission.assignmentId}/grade`, {
        studentId: selectedSubmission.student._id,
        marks: Number(marks),
        feedback: feedback,
      });
      
      // Refresh pending grades
      await fetchPendingGrades();
      handleCloseGradeDialog();
    } catch (error) {
      console.error('Error grading submission:', error);
      alert('Failed to grade submission');
    }
  };

  return (
    <>
      <Navbar title="Pending Grades" />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Avatar
              sx={{
                width: 60,
                height: 60,
                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              }}
            >
              <GradingIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h4">Pending Grades</Typography>
              <Typography variant="body2" color="text.secondary">
                Total Submissions to Grade: {pendingSubmissions.length}
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Paper sx={{ p: 3 }}>
          {loading ? (
            <Typography>Loading pending submissions...</Typography>
          ) : pendingSubmissions.length === 0 ? (
            <Box textAlign="center" py={4}>
              <GradingIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No pending submissions to grade
              </Typography>
              <Typography variant="body2" color="text.secondary">
                All caught up! 🎉
              </Typography>
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student</TableCell>
                  <TableCell>Assignment</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Submitted On</TableCell>
                  <TableCell>Total Marks</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingSubmissions.map((submission, index) => (
                  <TableRow key={`${submission.assignmentId}-${submission.student._id}-${index}`} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar sx={{ width: 32, height: 32 }}>
                          {submission.student?.name?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {submission.student?.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {submission.student?.blockchainId}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{submission.assignmentTitle}</TableCell>
                    <TableCell>
                      <Chip label={submission.subject} size="small" />
                    </TableCell>
                    <TableCell>
                      {new Date(submission.submittedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{submission.totalMarks}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleOpenGradeDialog(submission)}
                      >
                        Grade
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Paper>
      </Container>

      {/* Grade Dialog */}
      <Dialog open={gradeDialog} onClose={handleCloseGradeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Grade Submission</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body2" gutterBottom>
              <strong>Student:</strong> {selectedSubmission?.student?.name}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Assignment:</strong> {selectedSubmission?.assignmentTitle}
            </Typography>
            <Typography variant="body2" gutterBottom sx={{ mb: 3 }}>
              <strong>Total Marks:</strong> {selectedSubmission?.totalMarks}
            </Typography>

            {selectedSubmission?.submissionUrl && (
              <Box mb={2}>
                <Typography variant="body2" gutterBottom>
                  <strong>Submission:</strong>
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  href={selectedSubmission.submissionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Submission
                </Button>
              </Box>
            )}

            <TextField
              fullWidth
              label="Marks Obtained"
              type="number"
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
              inputProps={{
                min: 0,
                max: selectedSubmission?.totalMarks,
              }}
              sx={{ mb: 2 }}
              required
            />

            <TextField
              fullWidth
              label="Feedback (Optional)"
              multiline
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseGradeDialog}>Cancel</Button>
          <Button
            onClick={handleGradeSubmission}
            variant="contained"
            disabled={!marks || Number(marks) > selectedSubmission?.totalMarks}
          >
            Submit Grade
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PendingGrades;
