import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import {
    Container,
    Paper,
    Typography,
    Box,
    Grid,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Alert,
    Snackbar,
    CircularProgress,
    Card,
    CardContent,
    ToggleButton,
    ToggleButtonGroup,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import api from '../../utils/api';

const MarkAttendance = () => {
    const { user } = useAuth();
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [subject, setSubject] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        try {
            const res = await api.get('/branches');
            setBranches(res.data.branches || []);
        } catch (error) {
            console.error('Error fetching branches:', error);
        }
    };

    const fetchStudents = async () => {
        if (!selectedBranch || !selectedYear) {
            setSnackbar({
                open: true,
                message: 'Please select branch and year',
                severity: 'warning'
            });
            return;
        }

        try {
            setLoading(true);
            const params = {
                branch: selectedBranch,
                year: selectedYear,
                subject,
                date
            };
            if (selectedSection) params.classSection = selectedSection;

            const res = await api.get('/attendance/class', { params });
            setStudents(res.data.students || []);

            // Initialize attendance state
            const initialAttendance = {};
            res.data.students.forEach(student => {
                initialAttendance[student._id] = student.todayStatus || 'P'; // Default to Present
            });
            setAttendance(initialAttendance);
        } catch (error) {
            console.error('Error fetching students:', error);
            setSnackbar({
                open: true,
                message: 'Failed to load students',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAttendanceChange = (studentId, status) => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: status
        }));
    };

    const handleSubmit = async () => {
        if (!subject) {
            setSnackbar({
                open: true,
                message: 'Please enter subject name',
                severity: 'warning'
            });
            return;
        }

        if (students.length === 0) {
            setSnackbar({
                open: true,
                message: 'No students to mark attendance for',
                severity: 'warning'
            });
            return;
        }

        try {
            setSaving(true);
            const attendanceRecords = students.map(student => ({
                studentId: student._id,
                status: attendance[student._id] || 'P'
            }));

            await api.post('/attendance/mark', {
                attendanceRecords,
                subject,
                date
            });

            setSnackbar({
                open: true,
                message: 'Attendance marked successfully!',
                severity: 'success'
            });

            // Refresh the list to show updated data
            fetchStudents();
        } catch (error) {
            console.error('Error marking attendance:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Failed to mark attendance',
                severity: 'error'
            });
        } finally {
            setSaving(false);
        }
    };

    const getPresentCount = () => {
        return Object.values(attendance).filter(status => status === 'P').length;
    };

    const getAbsentCount = () => {
        return Object.values(attendance).filter(status => status === 'A').length;
    };

    return (
        <>
            <Navbar title="Mark Attendance" />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                {/* Header */}
                <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff' }}>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                        📋 Mark Attendance
                    </Typography>
                    <Typography variant="body1">
                        Faculty: {user?.name} | Teacher Code: {user?.teacherCode}
                    </Typography>
                </Paper>

                {/* Filters */}
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                        Class Details
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth>
                                <InputLabel>Branch</InputLabel>
                                <Select
                                    value={selectedBranch}
                                    onChange={(e) => setSelectedBranch(e.target.value)}
                                    label="Branch"
                                >
                                    {branches.map(branch => (
                                        <MenuItem key={branch._id} value={branch._id}>
                                            {branch.name} ({branch.code})
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                            <FormControl fullWidth>
                                <InputLabel>Year</InputLabel>
                                <Select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    label="Year"
                                >
                                    <MenuItem value="1">1st Year</MenuItem>
                                    <MenuItem value="2">2nd Year</MenuItem>
                                    <MenuItem value="3">3rd Year</MenuItem>
                                    <MenuItem value="4">4th Year</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                            <TextField
                                fullWidth
                                label="Section (Optional)"
                                value={selectedSection}
                                onChange={(e) => setSelectedSection(e.target.value)}
                                placeholder="e.g., A, B"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                fullWidth
                                label="Subject *"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="e.g., Mathematics"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                onClick={fetchStudents}
                                disabled={loading || !selectedBranch || !selectedYear}
                                fullWidth
                                sx={{ height: 56 }}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Load Students'}
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Summary Cards */}
                {students.length > 0 && (
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={12} sm={4}>
                            <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff' }}>
                                <CardContent>
                                    <Typography variant="h4" sx={{ fontWeight: 700 }}>{students.length}</Typography>
                                    <Typography variant="body2">Total Students</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: '#fff' }}>
                                <CardContent>
                                    <Typography variant="h4" sx={{ fontWeight: 700 }}>{getPresentCount()}</Typography>
                                    <Typography variant="body2">Present</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Card sx={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: '#fff' }}>
                                <CardContent>
                                    <Typography variant="h4" sx={{ fontWeight: 700 }}>{getAbsentCount()}</Typography>
                                    <Typography variant="body2">Absent</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                )}

                {/* Students Table */}
                {students.length > 0 && (
                    <Paper sx={{ p: 3 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Student List
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<SaveIcon />}
                                onClick={handleSubmit}
                                disabled={saving}
                                sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                            >
                                {saving ? <CircularProgress size={20} /> : 'Save Attendance'}
                            </Button>
                        </Box>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Roll No</strong></TableCell>
                                    <TableCell><strong>Name</strong></TableCell>
                                    <TableCell><strong>Blockchain ID</strong></TableCell>
                                    <TableCell><strong>Current %</strong></TableCell>
                                    <TableCell align="center"><strong>Attendance</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {students.map((student) => (
                                    <TableRow key={student._id} hover>
                                        <TableCell>{student.rollNumber || 'N/A'}</TableCell>
                                        <TableCell>{student.name}</TableCell>
                                        <TableCell>
                                            <Chip label={student.blockchainId} size="small" variant="outlined" />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={`${student.attendanceStats.percentage}%`}
                                                size="small"
                                                color={student.attendanceStats.percentage >= 75 ? 'success' : 'error'}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <ToggleButtonGroup
                                                value={attendance[student._id]}
                                                exclusive
                                                onChange={(e, newValue) => {
                                                    if (newValue !== null) {
                                                        handleAttendanceChange(student._id, newValue);
                                                    }
                                                }}
                                                size="small"
                                            >
                                                <ToggleButton
                                                    value="P"
                                                    sx={{
                                                        '&.Mui-selected': {
                                                            bgcolor: '#4caf50',
                                                            color: '#fff',
                                                            '&:hover': { bgcolor: '#45a049' }
                                                        }
                                                    }}
                                                >
                                                    <CheckCircleIcon sx={{ mr: 0.5 }} /> Present
                                                </ToggleButton>
                                                <ToggleButton
                                                    value="A"
                                                    sx={{
                                                        '&.Mui-selected': {
                                                            bgcolor: '#f44336',
                                                            color: '#fff',
                                                            '&:hover': { bgcolor: '#da190b' }
                                                        }
                                                    }}
                                                >
                                                    <CancelIcon sx={{ mr: 0.5 }} /> Absent
                                                </ToggleButton>
                                            </ToggleButtonGroup>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                )}

                {!loading && students.length === 0 && selectedBranch && selectedYear && (
                    <Paper sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="body1" color="text.secondary">
                            No students found for the selected class. Please check your filters.
                        </Typography>
                    </Paper>
                )}
            </Container>

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

export default MarkAttendance;
