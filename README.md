# AlgoOJ - Online Judge Platform

Welcome to AlgoOJ - A modern, feature-rich online judge platform for solving algorithmic programming challenges. This platform provides a seamless experience for both users practicing their coding skills and administrators managing the content.

## ✨ Key Features

### 👨‍💻 For Developers
- **Problem Solving**
  - Browse and solve programming challenges
  - Support for multiple programming languages
  - Real-time feedback on submissions
  - Detailed submission history
  - Performance analytics and progress tracking

- **Learning Experience**
  - Problems categorized by difficulty (Easy, Medium, Hard)
  - Clear problem descriptions and test cases
  - Instant feedback on code submissions
  - Personal progress dashboard

### 👨‍🔧 For Administrators
- **Content Management**
  - Intuitive problem creation interface
  - Comprehensive submission monitoring
  - User management system
  - Analytics dashboard

### 🛠️ Technical Highlights
- **Security**: JWT-based authentication & secure code execution
- **Performance**: Real-time submission processing
- **UI/UX**: Modern, responsive interface built with Material-UI
- **Architecture**: RESTful API design with robust error handling

## 🔧 Technologies Used

### Frontend Technologies
- **Core Framework**: React.js with TypeScript
- **UI Components**: Material-UI (MUI) v5
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Code Editor**: Monaco Editor
- **Date Handling**: date-fns
- **Form Handling**: React Hook Form
- **Charts**: Recharts for analytics

### Backend Technologies
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JSON Web Tokens (JWT)
- **Password Security**: bcrypt
- **API Security**: 
  - CORS for cross-origin resource sharing
  - Helmet for HTTP headers
  - Rate limiting
- **Code Execution**: Docker for isolated code running
- **Validation**: Joi/Yup

### Development & DevOps
- **Package Manager**: npm/yarn
- **Version Control**: Git
- **Code Quality**:
  - ESLint for linting
  - Prettier for code formatting
  - Jest for testing
- **API Documentation**: Swagger/OpenAPI
- **Environment**: Docker for containerization

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Quick Start Guide

1. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd online-judge
   ```

2. **Backend Configuration**
   ```bash
   cd backend
   npm install

   # Create .env file with:
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

4. **Launch Application**
   ```bash
   # Start MongoDB
   mongod

   # Start Backend (in backend directory)
   npm run dev

   # Start Frontend (in frontend directory)
   npm start
   ```

   Access the application:
   - Web Interface: http://localhost:3000
   - API Endpoint: http://localhost:5001

## 💡 How to Use

### For Problem Solvers
1. **Getting Started**
   - Create an account or login
   - Browse the problem library
   - Filter problems by difficulty or category

2. **Solving Problems**
   - Select a problem to solve
   - Write your solution in your preferred language
   - Submit your code for evaluation
   - Review submission results and feedback

3. **Track Progress**
   - View your submission history
   - Check your success rate
   - Monitor improvement over time

### For Administrators
1. **Platform Management**
   - Access admin dashboard using admin credentials
   - Create and edit programming problems
   - Review user submissions
   - Manage user accounts

2. **Content Moderation**
   - Monitor submission quality
   - Update problem test cases
   - Maintain problem difficulty levels

## 🔗 API Overview

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - User authentication

### Problems
- `GET /api/problems` - Retrieve problem list
- `GET /api/problems/:id` - Get problem details
- `POST /api/problems` - Create problem (Admin)

### Submissions
- `POST /api/submissions` - Submit solution
- `GET /api/submissions/my-submissions` - View personal submissions
- `GET /api/submissions/all` - View all submissions (Admin)

## 🤝 Contributing

We welcome contributions! Please follow these steps:
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
