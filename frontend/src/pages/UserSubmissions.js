import React from 'react';
import { Navigate } from 'react-router-dom';
import UserSubmissionsComponent from '../components/UserSubmissions';
import authService from '../services/auth.service';

const UserSubmissionsPage = () => {
  const user = authService.getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <UserSubmissionsComponent />
    </div>
  );
};

export default UserSubmissionsPage; 