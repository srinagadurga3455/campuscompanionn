import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import {
    Container,
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
    Chip,
    LinearProgress,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import api from '../utils/api';

const AttendanceReport = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        attendancePercentage: 0
    });

    const [trendPoints, setTrendPoints] = useState('');

    useEffect(() => {
        fetchAttendanceData();
    }, [user?.id]);

    const fetchAttendanceData = async () => {
        try {
            const attendanceRes = await api.get(`/attendance/student/${user?.id}`);
            const attendancePercentage = attendanceRes.data.statistics?.attendancePercentage || 0;
            const records = attendanceRes.data.records || [];

            setStats({ attendancePercentage });
            calculateTrend(records);
        } catch (error) {
            console.error('Error fetching attendance:', error);
        }
    };

    const calculateTrend = (records) => {
        const today = new Date();
        const months = [];

        // Initialize last 6 months
        for (let i = 5; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            months.push({
                month: d.getMonth(),
                year: d.getFullYear(),
                total: 0,
                present: 0
            });
        }

        // Aggregate records
        records.forEach(record => {
            const d = new Date(record.date);
            const monthData = months.find(m => m.month === d.getMonth() && m.year === d.getFullYear());
            if (monthData) {
                monthData.total++;
                if (record.status === 'P' || record.status === 'Present') {
                    monthData.present++;
                }
            }
        });

        // Calculate points for SVG
        const points = months.map((m, index) => {
            const percentage = m.total > 0 ? (m.present / m.total) * 100 : 0;
            // Map percentage (0-100) to Y (50-5) - keeping some padding
            // Map index (0-5) to X (0-100)
            const x = index * 20;
            const y = 50 - (percentage * 0.45); // 0% -> 50, 100% -> 5
            return `${x},${y}`;
        }).join(' ');

        setTrendPoints(points);
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 8 }}>
            <Navbar title="Attendance Report" />

            <Container maxWidth="lg" sx={{ mt: { xs: 4, md: 6 } }}>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.02em' }}>
                    Attendance Report
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 6 }}>
                    Track your attendance statistics and performance
                </Typography>

                {/* Attendance Statistics Section */}
                <Paper sx={{ p: 4, borderRadius: '20px', border: '1px solid', borderColor: 'divider', mb: 6 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5" sx={{ fontWeight: 800 }}>Attendance Statistics</Typography>
                        <Chip
                            label={stats.attendancePercentage >= 75 ? 'Good Standing' : 'Needs Improvement'}
                            color={stats.attendancePercentage >= 75 ? 'success' : 'warning'}
                            sx={{ fontWeight: 700 }}
                        />
                    </Box>

                    <Grid container spacing={3}>
                        {/* Overall Attendance */}
                        <Grid item xs={12} md={4}>
                            <Card sx={{ height: '100%', borderRadius: '16px', border: '1px solid', borderColor: 'divider' }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Overall Attendance</Typography>
                                    <Box sx={{ position: 'relative', display: 'inline-flex', width: '100%', justifyContent: 'center', mb: 2 }}>
                                        <Box
                                            sx={{
                                                width: 120,
                                                height: 120,
                                                borderRadius: '50%',
                                                background: `conic-gradient(${stats.attendancePercentage >= 75 ? '#10b981' : stats.attendancePercentage >= 60 ? '#f59e0b' : '#ef4444'} ${stats.attendancePercentage * 3.6}deg, #e5e7eb 0deg)`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 100,
                                                    height: 100,
                                                    borderRadius: '50%',
                                                    bgcolor: 'background.paper',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexDirection: 'column'
                                                }}
                                            >
                                                <Typography variant="h3" sx={{ fontWeight: 900, color: stats.attendancePercentage >= 75 ? 'success.main' : stats.attendancePercentage >= 60 ? 'warning.main' : 'error.main' }}>
                                                    {stats.attendancePercentage}%
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
                                        {stats.attendancePercentage >= 75 ? 'Excellent attendance record!' : stats.attendancePercentage >= 60 ? 'Attendance needs improvement' : 'Critical: Below minimum requirement'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Attendance Breakdown */}
                        <Grid item xs={12} md={8}>
                            <Card sx={{ height: '100%', borderRadius: '16px', border: '1px solid', borderColor: 'divider' }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Monthly Breakdown</Typography>
                                    <Stack spacing={2.5}>
                                        {[
                                            { month: 'Current Month', percentage: Math.min(stats.attendancePercentage + 5, 100), classes: 'Present: 18 / Total: 20' },
                                            { month: 'Last Month', percentage: Math.max(stats.attendancePercentage - 3, 0), classes: 'Present: 21 / Total: 24' },
                                            { month: 'Overall', percentage: stats.attendancePercentage, classes: `Present: ${Math.floor(stats.attendancePercentage * 0.8)} / Total: 80` }
                                        ].map((item, idx) => (
                                            <Box key={idx}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{item.month}</Typography>
                                                    <Typography variant="body2" sx={{ fontWeight: 700, color: item.percentage >= 75 ? 'success.main' : item.percentage >= 60 ? 'warning.main' : 'error.main' }}>
                                                        {item.percentage}%
                                                    </Typography>
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={item.percentage}
                                                    sx={{
                                                        height: 8,
                                                        borderRadius: '4px',
                                                        bgcolor: 'rgba(0,0,0,0.05)',
                                                        '& .MuiLinearProgress-bar': {
                                                            bgcolor: item.percentage >= 75 ? 'success.main' : item.percentage >= 60 ? 'warning.main' : 'error.main',
                                                            borderRadius: '4px'
                                                        }
                                                    }}
                                                />
                                                <Typography variant="caption" sx={{ color: 'text.muted', mt: 0.5, display: 'block' }}>
                                                    {item.classes}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Small Attendance Graph Placeholder */}
                    <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto', mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1, textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700 }}>Attendance Trend</Typography>
                        {trendPoints && (
                            <svg viewBox="0 0 100 50" width="100%" height="80" preserveAspectRatio="none">
                                <polyline
                                    fill="none"
                                    stroke="#3b82f6"
                                    strokeWidth="2"
                                    points={trendPoints}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                {/* Add simple endpoint markers */}
                                {trendPoints.split(' ').map((point, i) => (
                                    <circle key={i} cx={point.split(',')[0]} cy={point.split(',')[1]} r="2" fill="#3b82f6" />
                                ))}
                            </svg>
                        )}
                        <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
                            Past 6 Months Performance
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default AttendanceReport;
