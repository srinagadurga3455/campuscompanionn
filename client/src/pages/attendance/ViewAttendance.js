import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import {
    Container,
    Paper,
    Typography,
    Box,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    LinearProgress,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import api from '../../utils/api';

const ViewAttendance = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [attendanceData, setAttendanceData] = useState(null);

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/attendance/student/${user?.id}`);
            setAttendanceData(res.data);
        } catch (error) {
            console.error('Error fetching attendance:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar title="My Attendance" />
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                        <CircularProgress size={60} />
                    </Box>
                </Container>
            </>
        );
    }

    const stats = attendanceData?.statistics || {};
    const subjectWise = stats.subjectWise || {};

    return (
        <>
            <Navbar title="My Attendance" />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                {/* Header */}
                <Paper
                    sx={{
                        p: 4,
                        mb: 3,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: '#fff',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                        📊 My Attendance
                    </Typography>
                    <Typography variant="body1">
                        Track your attendance across all subjects
                    </Typography>
                </Paper>

                {/* Overall Statistics */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={3}>
                        <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff' }}>
                            <CardContent>
                                <Box display="flex" alignItems="center" gap={2}>
                                    <TrendingUpIcon fontSize="large" />
                                    <Box>
                                        <Typography variant="h3" sx={{ fontWeight: 700 }}>
                                            {stats.attendancePercentage || 0}%
                                        </Typography>
                                        <Typography variant="body2">Overall Attendance</Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: '#fff' }}>
                            <CardContent>
                                <Box display="flex" alignItems="center" gap={2}>
                                    <CheckCircleIcon fontSize="large" />
                                    <Box>
                                        <Typography variant="h3" sx={{ fontWeight: 700 }}>
                                            {stats.presentCount || 0}
                                        </Typography>
                                        <Typography variant="body2">Classes Present</Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card sx={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: '#fff' }}>
                            <CardContent>
                                <Box display="flex" alignItems="center" gap={2}>
                                    <CancelIcon fontSize="large" />
                                    <Box>
                                        <Typography variant="h3" sx={{ fontWeight: 700 }}>
                                            {stats.absentCount || 0}
                                        </Typography>
                                        <Typography variant="body2">Classes Absent</Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: '#fff' }}>
                            <CardContent>
                                <Box display="flex" alignItems="center" gap={2}>
                                    <Box
                                        sx={{
                                            width: 56,
                                            height: 56,
                                            borderRadius: '50%',
                                            background: 'rgba(255, 255, 255, 0.2)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '24px'
                                        }}
                                    >
                                        📚
                                    </Box>
                                    <Box>
                                        <Typography variant="h3" sx={{ fontWeight: 700 }}>
                                            {stats.totalClasses || 0}
                                        </Typography>
                                        <Typography variant="body2">Total Classes</Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Subject-wise Attendance */}
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                        Subject-wise Attendance
                    </Typography>
                    <Grid container spacing={2}>
                        {Object.keys(subjectWise).length > 0 ? (
                            Object.entries(subjectWise).map(([subject, data]) => (
                                <Grid item xs={12} md={6} key={subject}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                    {subject}
                                                </Typography>
                                                <Chip
                                                    label={`${data.percentage}%`}
                                                    color={parseFloat(data.percentage) >= 75 ? 'success' : 'error'}
                                                    sx={{ fontWeight: 600 }}
                                                />
                                            </Box>
                                            <LinearProgress
                                                variant="determinate"
                                                value={parseFloat(data.percentage)}
                                                sx={{
                                                    height: 8,
                                                    borderRadius: 4,
                                                    mb: 1,
                                                    bgcolor: 'rgba(0,0,0,0.1)',
                                                    '& .MuiLinearProgress-bar': {
                                                        background: parseFloat(data.percentage) >= 75
                                                            ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                                                            : 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
                                                    }
                                                }}
                                            />
                                            <Box display="flex" justifyContent="space-between">
                                                <Typography variant="body2" color="text.secondary">
                                                    Present: {data.present} | Absent: {data.absent}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Total: {data.total}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))
                        ) : (
                            <Grid item xs={12}>
                                <Typography variant="body2" color="text.secondary" textAlign="center">
                                    No attendance records found
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                </Paper>

                {/* Recent Attendance Records */}
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                        Recent Attendance Records
                    </Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Date</strong></TableCell>
                                <TableCell><strong>Subject</strong></TableCell>
                                <TableCell><strong>Status</strong></TableCell>
                                <TableCell><strong>Faculty</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {attendanceData?.records && attendanceData.records.length > 0 ? (
                                attendanceData.records.slice(0, 10).map((record, index) => (
                                    <TableRow key={index} hover>
                                        <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                                        <TableCell>{record.subject}</TableCell>
                                        <TableCell>
                                            <Chip
                                                icon={record.status === 'P' ? <CheckCircleIcon /> : <CancelIcon />}
                                                label={record.status === 'P' ? 'Present' : 'Absent'}
                                                color={record.status === 'P' ? 'success' : 'error'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>{record.faculty?.name || 'N/A'}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        <Typography variant="body2" color="text.secondary">
                                            No attendance records yet
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Paper>
            </Container>
        </>
    );
};

export default ViewAttendance;
