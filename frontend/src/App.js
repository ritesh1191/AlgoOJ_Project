import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { Box, CssBaseline, IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Toaster } from 'react-hot-toast';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import AdminDashboard from './components/AdminDashboard';
import CreateProblem from './components/CreateProblem';
import ProblemDetail from './components/ProblemDetail';
import MySubmissions from './components/MySubmissions';
import AllSubmissions from './components/AllSubmissions';
import Profile from './components/Profile';
import Navbar from './components/Navbar';
import authService from './services/auth.service';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import baseTheme from './theme';

const PrivateRoute = ({ children, requiredRole }) => {
  const user = authService.getCurrentUser();
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;
  }
  return children;
};

function App() {
  const [mode, setMode] = useState('light');

  const theme = useMemo(
    () =>
      createTheme({
        ...baseTheme,
        palette: {
          ...baseTheme.palette,
          mode,
          ...(mode === 'dark' && {
                primary: {
                  main: '#60a5fa',
                  light: '#93c5fd',
                  dark: '#2563eb',
                  contrastText: '#ffffff',
                },
                secondary: {
                  main: '#a78bfa',
                  light: '#c4b5fd',
                  dark: '#7c3aed',
                  contrastText: '#ffffff',
                },
                background: {
                  default: '#0f172a',
                  paper: '#1e293b',
                },
                text: {
                  primary: '#f8fafc',
                  secondary: '#cbd5e1',
                },
              }),
        },
      }),
    [mode]
  );

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    []
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <Box component="main" sx={{ mt: '70px', flexGrow: 1 }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/problem/:id" element={<ProblemDetail />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <PrivateRoute requiredRole="admin">
                    <AdminDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/all-submissions"
                element={
                  <PrivateRoute requiredRole="admin">
                    <AllSubmissions />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/create-problem"
                element={
                  <PrivateRoute requiredRole="admin">
                    <CreateProblem />
                  </PrivateRoute>
                }
              />
              <Route
                path="/my-submissions"
                element={
                  <PrivateRoute>
                    <MySubmissions />
                  </PrivateRoute>
                }
              />
            </Routes>
          </Box>
        </Box>
        <IconButton
          sx={{
            position: 'fixed',
            top: '50%',
            right: '0',
            transform: 'translateY(-50%)',
            zIndex: 1100,
            bgcolor: 'background.paper',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            borderRadius: '8px 0 0 8px',
            padding: '12px 8px',
            '&:hover': {
              bgcolor: 'background.paper',
              right: '0',
            },
          }}
          onClick={colorMode.toggleColorMode}
          color="inherit"
        >
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        <Toaster
          position="top-right"
          toastOptions={{
            success: {
              style: {
                background: theme.palette.success.main,
                color: '#ffffff',
                borderRadius: '8px',
                padding: '16px',
              },
            },
            error: {
              style: {
                background: theme.palette.error.main,
                color: '#ffffff',
                borderRadius: '8px',
                padding: '16px',
              },
            },
            duration: 3000,
          }}
        />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Router>
    </ThemeProvider>
  );
}

export default App;
