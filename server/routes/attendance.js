const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/roleCheck');

// @route   POST /api/attendance/mark
// @desc    Mark attendance for students (Faculty only)
// @access  Private (faculty)
router.post('/mark', authMiddleware, roleMiddleware('faculty'), async (req, res) => {
    try {
        const { attendanceRecords, subject, date } = req.body;

        if (!attendanceRecords || !Array.isArray(attendanceRecords) || attendanceRecords.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Attendance records are required'
            });
        }

        if (!subject) {
            return res.status(400).json({
                success: false,
                message: 'Subject is required'
            });
        }

        const attendanceDate = date ? new Date(date) : new Date();
        attendanceDate.setHours(0, 0, 0, 0); // Normalize to start of day

        const savedRecords = [];
        const errors = [];

        for (const record of attendanceRecords) {
            try {
                const { studentId, status, remarks } = record;

                // Validate student
                const student = await User.findById(studentId);
                if (!student || student.role !== 'student') {
                    errors.push({ studentId, error: 'Invalid student' });
                    continue;
                }

                // Check if attendance already exists for this student, subject, and date
                const existing = await Attendance.findOne({
                    student: studentId,
                    subject,
                    date: attendanceDate
                });

                if (existing) {
                    // Update existing record
                    existing.status = status;
                    existing.remarks = remarks || '';
                    existing.faculty = req.user.id;
                    await existing.save();
                    savedRecords.push(existing);
                } else {
                    // Create new record
                    const attendance = new Attendance({
                        student: studentId,
                        faculty: req.user.id,
                        subject,
                        date: attendanceDate,
                        status,
                        branch: student.branch,
                        year: student.year,
                        classSection: student.classSection,
                        remarks: remarks || ''
                    });
                    await attendance.save();
                    savedRecords.push(attendance);
                }
            } catch (error) {
                console.error('Error marking attendance for student:', record.studentId, error);
                errors.push({ studentId: record.studentId, error: error.message });
            }
        }

        res.json({
            success: true,
            message: `Attendance marked for ${savedRecords.length} students`,
            savedCount: savedRecords.length,
            errorCount: errors.length,
            errors: errors.length > 0 ? errors : undefined
        });
    } catch (error) {
        console.error('Mark attendance error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   GET /api/attendance/student/:studentId
// @desc    Get attendance records for a specific student
// @access  Private
router.get('/student/:studentId', authMiddleware, async (req, res) => {
    try {
        const { studentId } = req.params;
        const { subject, startDate, endDate } = req.query;

        // Students can only view their own attendance, others need proper role
        if (req.user.role === 'student' && req.user.id !== studentId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        const filter = { student: studentId };
        if (subject) filter.subject = subject;
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);
            if (endDate) filter.date.$lte = new Date(endDate);
        }

        const records = await Attendance.find(filter)
            .populate('faculty', 'name teacherCode')
            .populate('branch', 'name code')
            .sort({ date: -1 });

        // Calculate attendance percentage
        const totalClasses = records.length;
        const presentCount = records.filter(r => r.status === 'P').length;
        const attendancePercentage = totalClasses > 0 ? ((presentCount / totalClasses) * 100).toFixed(2) : 0;

        // Group by subject
        const subjectWise = {};
        records.forEach(record => {
            if (!subjectWise[record.subject]) {
                subjectWise[record.subject] = { total: 0, present: 0, absent: 0 };
            }
            subjectWise[record.subject].total++;
            if (record.status === 'P') {
                subjectWise[record.subject].present++;
            } else {
                subjectWise[record.subject].absent++;
            }
        });

        // Calculate percentage for each subject
        Object.keys(subjectWise).forEach(subject => {
            const data = subjectWise[subject];
            data.percentage = data.total > 0 ? ((data.present / data.total) * 100).toFixed(2) : 0;
        });

        res.json({
            success: true,
            records,
            statistics: {
                totalClasses,
                presentCount,
                absentCount: totalClasses - presentCount,
                attendancePercentage: parseFloat(attendancePercentage),
                subjectWise
            }
        });
    } catch (error) {
        console.error('Get student attendance error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   GET /api/attendance/class
// @desc    Get attendance for a class (Faculty)
// @access  Private (faculty, college_admin)
router.get('/class', authMiddleware, roleMiddleware('faculty', 'college_admin'), async (req, res) => {
    try {
        const { branch, year, classSection, subject, date } = req.query;

        if (!branch || !year) {
            return res.status(400).json({
                success: false,
                message: 'Branch and year are required'
            });
        }

        // Get all students in the class
        const studentFilter = {
            role: 'student',
            approvalStatus: 'approved',
            branch,
            year: parseInt(year)
        };
        if (classSection) studentFilter.classSection = classSection;

        const students = await User.find(studentFilter)
            .select('name email blockchainId rollNumber')
            .populate('branch', 'name code')
            .sort({ rollNumber: 1, name: 1 });

        // Get attendance records if date and subject are provided
        let attendanceRecords = [];
        if (date && subject) {
            const attendanceDate = new Date(date);
            attendanceDate.setHours(0, 0, 0, 0);

            attendanceRecords = await Attendance.find({
                branch,
                year: parseInt(year),
                subject,
                date: attendanceDate
            }).populate('student', 'name email blockchainId rollNumber');
        }

        // Calculate individual attendance percentages for each student
        const studentsWithAttendance = await Promise.all(students.map(async (student) => {
            const filter = {
                student: student._id,
                branch,
                year: parseInt(year)
            };
            if (subject) filter.subject = subject;

            const studentRecords = await Attendance.find(filter);
            const total = studentRecords.length;
            const present = studentRecords.filter(r => r.status === 'P').length;
            const percentage = total > 0 ? ((present / total) * 100).toFixed(2) : 0;

            // Find today's attendance if date is provided
            const todayRecord = attendanceRecords.find(r =>
                r.student._id.toString() === student._id.toString()
            );

            return {
                ...student.toObject(),
                attendanceStats: {
                    total,
                    present,
                    absent: total - present,
                    percentage: parseFloat(percentage)
                },
                todayStatus: todayRecord ? todayRecord.status : null
            };
        }));

        res.json({
            success: true,
            students: studentsWithAttendance,
            classInfo: {
                branch,
                year,
                classSection,
                totalStudents: students.length
            }
        });
    } catch (error) {
        console.error('Get class attendance error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   GET /api/attendance/subjects
// @desc    Get unique subjects for a faculty
// @access  Private (faculty)
router.get('/subjects', authMiddleware, roleMiddleware('faculty'), async (req, res) => {
    try {
        const subjects = await Attendance.distinct('subject', { faculty: req.user.id });

        res.json({
            success: true,
            subjects
        });
    } catch (error) {
        console.error('Get subjects error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   GET /api/attendance/report
// @desc    Get attendance report for a class/subject
// @access  Private (faculty, college_admin)
router.get('/report', authMiddleware, roleMiddleware('faculty', 'college_admin'), async (req, res) => {
    try {
        const { branch, year, classSection, subject, startDate, endDate } = req.query;

        if (!branch || !year || !subject) {
            return res.status(400).json({
                success: false,
                message: 'Branch, year, and subject are required'
            });
        }

        const filter = {
            branch,
            year: parseInt(year),
            subject
        };
        if (classSection) filter.classSection = classSection;
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);
            if (endDate) filter.date.$lte = new Date(endDate);
        }

        const records = await Attendance.find(filter)
            .populate('student', 'name email blockchainId rollNumber')
            .populate('faculty', 'name teacherCode')
            .sort({ date: -1, 'student.rollNumber': 1 });

        // Group by student
        const studentWise = {};
        records.forEach(record => {
            const studentId = record.student._id.toString();
            if (!studentWise[studentId]) {
                studentWise[studentId] = {
                    student: record.student,
                    total: 0,
                    present: 0,
                    absent: 0,
                    records: []
                };
            }
            studentWise[studentId].total++;
            if (record.status === 'P') {
                studentWise[studentId].present++;
            } else {
                studentWise[studentId].absent++;
            }
            studentWise[studentId].records.push({
                date: record.date,
                status: record.status,
                faculty: record.faculty
            });
        });

        // Calculate percentages
        Object.keys(studentWise).forEach(studentId => {
            const data = studentWise[studentId];
            data.percentage = data.total > 0 ? ((data.present / data.total) * 100).toFixed(2) : 0;
        });

        res.json({
            success: true,
            report: Object.values(studentWise),
            summary: {
                totalStudents: Object.keys(studentWise).length,
                totalClasses: records.length > 0 ? Math.max(...Object.values(studentWise).map(s => s.total)) : 0
            }
        });
    } catch (error) {
        console.error('Get attendance report error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;
