import React from 'react';
import { Navigate } from 'react-router-dom';
import AdminSubmissions from '../components/AdminSubmissions';
import authService from '../services/auth.service';

const AdminDashboard = () => {
  const user = authService.getCurrentUser();

  if (!user || !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <AdminSubmissions />
    </div>
  );
};

export default AdminDashboard; 