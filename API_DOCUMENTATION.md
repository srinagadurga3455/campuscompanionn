# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Auth Routes (`/api/auth`)

#### POST /register
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+911234567890",
  "role": "student",
  "year": 2,
  "enrollmentYear": 2023,
  "classSection": "A"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful. Awaiting admin approval.",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "approvalStatus": "pending"
  }
}
```

#### POST /login
Login user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "role": "student",
    "blockchainId": "2301CS0001"
  }
}
```

### User Routes (`/api/users`)

#### GET /pending
Get all pending user approvals (Admin only).

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "approvalStatus": "pending"
    }
  ]
}
```

#### PUT /:id/approve
Approve a user registration (Admin only).

**Response:**
```json
{
  "success": true,
  "message": "User approved successfully",
  "user": {
    "id": "...",
    "name": "John Doe",
    "blockchainId": "2301CS0001"
  }
}
```

### Event Routes (`/api/events`)

#### GET /
Get all events.

**Query Parameters:**
- `eventType`: Filter by type
- `upcoming`: true/false
- `status`: upcoming/ongoing/completed

**Response:**
```json
{
  "success": true,
  "events": [
    {
      "id": "...",
      "title": "Tech Fest 2024",
      "eventType": "technical",
      "startDate": "2024-03-15",
      "venue": "Main Auditorium"
    }
  ]
}
```

#### POST /
Create new event (Club Admin only).

**Request Body:**
```json
{
  "title": "Tech Fest 2024",
  "description": "Annual technical festival",
  "eventType": "technical",
  "startDate": "2024-03-15",
  "endDate": "2024-03-17",
  "venue": "Main Auditorium",
  "maxParticipants": 500
}
```

#### POST /:id/register
Register for an event.

**Response:**
```json
{
  "success": true,
  "message": "Successfully registered for event"
}
```

### Certificate Routes (`/api/certificates`)

#### POST /
Issue a certificate (Admin only).

**Request Body:**
```json
{
  "title": "Tech Fest Participation",
  "recipient": "user_id",
  "event": "event_id",
  "certificateType": "participation"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Certificate issued successfully",
  "certificate": {
    "id": "...",
    "blockchainTxHash": "0x...",
    "verificationUrl": "http://..."
  }
}
```

#### GET /verify/:id
Verify certificate authenticity (Public).

**Response:**
```json
{
  "success": true,
  "verified": true,
  "certificate": {
    "title": "Tech Fest Participation",
    "recipient": "John Doe",
    "issuedDate": "2024-03-20",
    "blockchainTxHash": "0x..."
  }
}
```

### Blockchain Routes (`/api/blockchain`)

#### GET /student/:blockchainId
Get student details from blockchain (Public).

**Response:**
```json
{
  "success": true,
  "student": {
    "blockchainId": "2301CS0001",
    "name": "John Doe",
    "email": "john@example.com",
    "isActive": true,
    "mintedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### POST /verify/student/:blockchainId
Verify student ID on blockchain (Public).

**Response:**
```json
{
  "success": true,
  "verified": true,
  "blockchainId": "2301CS0001"
}
```

## Error Responses

All endpoints return errors in this format:
```json
{
  "success": false,
  "message": "Error description"
}
```

**Common Status Codes:**
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error
