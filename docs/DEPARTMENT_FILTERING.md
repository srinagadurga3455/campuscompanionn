# Department-Based Filtering System

## Overview
The Campus Companion app now implements strict department-based filtering to ensure students and faculty only see content relevant to their department.

## How It Works

### For Students
Students can only view:
- **Assignments**: From their department and year
- **Events**: Department-specific events + college-wide events
- **Classmates**: Students in same department and year
- **Certificates/Badges**: Their own achievements

### For Faculty
Faculty can only view/manage:
- **Assignments**: Only from their department
- **Students**: Only students from their department
- **Events**: Department events + college-wide events
- **Submissions**: Only from students in their department

### For College Admins
College admins have full access across all departments.

## Backend Implementation

### Routes with Department Filtering

**1. Assignments (`/api/assignments`)**
```javascript
// Students: department + year match
filter = { department: req.user.department, year: req.user.year };

// Faculty: their department only
filter = { faculty: req.user.id, department: req.user.department };
```

**2. Events (`/api/events`)**
```javascript
// Students & Faculty see:
filter.$or = [
  { department: req.user.department },  // Their department
  { department: null },                  // College-wide
  { eventType: 'college' }              // College events
];
```

**3. Students List (`/api/users/students`)**
```javascript
// Faculty see only their department students
if (req.user.role === 'faculty') {
  filter.department = req.user.department;
}
```

## Database Models

### User Model
```javascript
{
  department: { type: ObjectId, ref: 'Department' },
  year: Number,
  classSection: String,
  role: String
}
```

### Assignment Model
```javascript
{
  department: { type: ObjectId, ref: 'Department', required: true },
  year: Number,
  section: String,
  faculty: { type: ObjectId, ref: 'User' }
}
```

### Event Model
```javascript
{
  department: { type: ObjectId, ref: 'Department' },
  eventType: String, // 'department', 'college', 'club'
  club: { type: ObjectId, ref: 'Club' }
}
```

## Frontend Dashboard Updates

### Student Dashboard
- Shows department name in welcome section
- Displays only department-relevant assignments
- Lists department and college-wide events
- Counts department-specific stats

### Faculty Dashboard
- Shows department name in header
- Lists students count from department
- Shows only department assignments
- Filters all data by department automatically

## Testing Department Filtering

### Test Scenario 1: Create Multiple Departments
```javascript
// Sample departments
- Computer Science (CS)
- Electronics (EC)
- Mechanical (ME)
```

### Test Scenario 2: Create Students in Different Departments
```javascript
// Student 1: CS Department, Year 2
// Student 2: EC Department, Year 2
// Each should only see their department's content
```

### Test Scenario 3: Faculty Assignment Creation
```javascript
// Faculty from CS creates assignment
// Only CS students of specified year should see it
// EC students should NOT see it
```

## Configuration

### Sample Department Codes
```
CS - Computer Science (01)
EC - Electronics (02)
ME - Mechanical (03)
CE - Civil Engineering (04)
EE - Electrical Engineering (05)
```

### Blockchain ID Format
Format: `YYCCAAxxxx`
- YY: Year (23 = 2023)
- CC: College Code (01 = Main Campus)
- AA: Department Code (01 = CS, 02 = EC, etc.)
- xxxx: Sequential number

Example: `2301010001` = 2023, Campus 01, CS Dept, Student #1

## Benefits

1. **Data Privacy**: Students can't access other department's data
2. **Focused Content**: Users see only relevant information
3. **Scalability**: Works with any number of departments
4. **Role-Based Access**: Automatic filtering based on user role
5. **College-Wide Events**: Still allows campus-wide activities

## Future Enhancements

1. **Cross-Department Collaboration**: Allow faculty to share content across departments
2. **Department Analytics**: Track department-wise performance
3. **Department Chat**: Department-specific communication channels
4. **Inter-Department Events**: Better handling of multi-department events
