# AlgoOJ - Online Judge Platform

AlgoOJ is a modern online judge platform where users can solve algorithmic programming problems. The platform supports multiple programming languages, provides real-time feedback, and includes an admin interface for problem management.

## Features

### User Features
- 🔐 User authentication (Register/Login)
- 📝 Browse programming problems
- 💻 Submit solutions to problems
- 📊 View submission history
- 🎯 Problem difficulty levels (Easy, Medium, Hard)
- 📈 Track personal progress

### Admin Features
- ➕ Create and manage problems
- 📋 View all user submissions
- 🎮 Admin dashboard
- 👥 User management
- 📊 Submission analytics

### Technical Features
- ⚡ Real-time submission feedback
- 🔒 Secure code execution
- 🎨 Modern, responsive UI
- 🌐 RESTful API architecture
- 🔑 JWT-based authentication
- 🛡️ Role-based access control

## Technologies Used

### Frontend
- React.js
- Material-UI (MUI)
- Axios for API calls
- React Router for navigation
- date-fns for date formatting

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- CORS for cross-origin resource sharing

## Prerequisites

Before running the project locally, make sure you have:
- Node.js (v14 or higher)
- MongoDB installed and running
- npm or yarn package manager

## Installation and Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd online-judge
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   
   Create a `.env` file in the backend directory:
   ```
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/online-judge
   JWT_SECRET=your-secret-key-here
   NODE_ENV=development
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

## Running the Application

1. **Start MongoDB**
   ```bash
   mongod
   ```

2. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   The backend server will start on port 5001.

3. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm start
   ```
   The frontend development server will start on port 3000.

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001

## Usage

### As a User
1. Register a new account or login
2. Browse available problems
3. Select a problem to solve
4. Submit your solution
5. View your submission history
6. Track your progress

### As an Admin
1. Login with admin credentials
2. Access admin dashboard
3. Create new problems
4. View all user submissions
5. Manage platform content

## API Documentation

### Authentication Endpoints
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login

### Problem Endpoints
- GET `/api/problems` - Get all problems
- GET `/api/problems/:id` - Get specific problem
- POST `/api/problems` - Create new problem (Admin only)

### Submission Endpoints
- POST `/api/submissions` - Submit solution
- GET `/api/submissions/my-submissions` - Get user's submissions
- GET `/api/submissions/all` - Get all submissions (Admin only)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Material-UI for the beautiful UI components
- MongoDB for the robust database solution
- Express.js for the efficient backend framework
- React.js for the powerful frontend framework

## Contact

Your Name - your.email@example.com
Project Link: [https://github.com/yourusername/online-judge](https://github.com/yourusername/online-judge) 