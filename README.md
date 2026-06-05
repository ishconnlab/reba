# Store Management System (SMS)

A full-stack web application for DAB Enterprise LTD to manage employees, stock purchases, and stock sales.

## Tech Stack

### Frontend
- React.js (Vite)
- React Router DOM
- Axios
- Tailwind CSS
- React Icons
- Context API

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose ODM)
- Express Session
- bcryptjs
- express-validator

## Project Structure

```
├── backend/
│   ├── config/         # Database configuration
│   ├── controllers/    # Route controllers
│   ├── middleware/      # Auth, validation, error handling
│   ├── models/         # Mongoose models
│   ├── routes/         # Express routes
│   ├── services/       # Business logic
│   ├── utils/          # Helper functions
│   ├── app.js          # Express app setup
│   └── server.js       # Server entry point
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── context/    # Auth context
│   │   ├── hooks/      # Custom hooks
│   │   ├── layouts/    # Main layout
│   │   ├── pages/      # Page components
│   │   ├── routes/     # App routes
│   │   └── services/   # API service layer
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v6 or higher)
- npm or yarn

### 1. Clone and Navigate
```bash
cd 
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```
The server will start on `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The client will start on `http://localhost:5173`.

### 4. Database
Ensure MongoDB is running locally on port 27017. The database name is `SMS`.

### 5. Create Admin User
Start the backend and frontend, then register an admin user via the API:
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"userName":"admin","password":"admin123","role":"admin"}'
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Users (Admin only)
- `POST /api/users` - Create user
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Stock In
- `POST /api/stockin` - Add stock in
- `GET /api/stockin` - Get all stock in records
- `GET /api/stockin/:id` - Get stock in record
- `PUT /api/stockin/:id` - Update stock in record
- `DELETE /api/stockin/:id` - Delete stock in record

### Stock Out
- `POST /api/stockout` - Add stock out
- `GET /api/stockout` - Get all stock out records
- `GET /api/stockout/:id` - Get stock out record
- `PUT /api/stockout/:id` - Update stock out record
- `DELETE /api/stockout/:id` - Delete stock out record

### Reports
- `GET /api/reports/daily-stock-status` - Daily stock status
- `GET /api/reports/date-range?startDate=&endDate=` - Date range report

## Features

- Session-based authentication
- Role-based access control (Admin/Staff)
- Full CRUD for Stock In, Stock Out, and Users
- Search, pagination, and date filtering
- Real-time inventory tracking
- Daily stock status reports
- Export reports to CSV
- Print reports
- Responsive design
- Custom item support
