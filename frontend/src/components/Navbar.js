import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Divider,
  Chip,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Code as CodeIcon } from '@mui/icons-material';
import authService from '../services/auth.service';

const Navbar = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  console.log('Current user:', user); // Debug log

  return (
    <AppBar 
      position="static" 
      sx={{ 
        backgroundColor: 'background.paper',
        color: 'text.primary',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
              gap: 1,
              mr: 3,
              '&:hover': {
                '& .logo-icon': {
                  transform: 'rotate(20deg)',
                },
              },
            }}
          >
            <CodeIcon
              className="logo-icon"
              sx={{
                fontSize: '2rem',
                color: 'primary.main',
                transition: 'transform 0.3s ease-in-out',
              }}
            />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                letterSpacing: '-0.025em',
                background: 'linear-gradient(45deg, #2563eb 30%, #7c3aed 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              Algo
              <Box
                component="span"
                sx={{
                  color: '#7c3aed',
                  WebkitTextFillColor: '#7c3aed',
                  fontWeight: 900,
                }}
              >
                OJ
              </Box>
            </Typography>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexGrow: 1 }}>
            <Button
              component={Link}
              to="/"
              sx={{
                color: 'text.primary',
                fontWeight: 500,
                '&:hover': {
                  color: 'primary.main',
                  backgroundColor: 'rgba(37, 99, 235, 0.04)',
                },
              }}
            >
              Problems
            </Button>

            {user ? (
              // Show these links when user is logged in
              <>
                <Button
                  component={Link}
                  to="/my-submissions"
                  sx={{
                    color: 'text.primary',
                    fontWeight: 500,
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: 'rgba(37, 99, 235, 0.04)',
                    },
                  }}
                >
                  My Submissions
                </Button>
                {user.role === 'admin' && (
                  <>
                    <Button
                      component={Link}
                      to="/admin"
                      sx={{
                        color: 'text.primary',
                        fontWeight: 500,
                        '&:hover': {
                          color: 'primary.main',
                          backgroundColor: 'rgba(37, 99, 235, 0.04)',
                        },
                      }}
                    >
                      Admin Dashboard
                    </Button>
                    <Button
                      component={Link}
                      to="/admin/create-problem"
                      sx={{
                        color: 'text.primary',
                        fontWeight: 500,
                        '&:hover': {
                          color: 'primary.main',
                          backgroundColor: 'rgba(37, 99, 235, 0.04)',
                        },
                      }}
                    >
                      Create Problem
                    </Button>
                  </>
                )}
              </>
            ) : null}
          </Box>

          {/* Auth Section */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {user ? (
              <>
                <Chip
                  label={`Role: ${user.role || 'N/A'}`}
                  size="small"
                  color={user.role === 'admin' ? 'secondary' : 'default'}
                  sx={{
                    fontWeight: 500,
                    backgroundColor: user.role === 'admin' ? 'rgba(124, 58, 237, 0.1)' : 'rgba(0, 0, 0, 0.08)',
                    color: user.role === 'admin' ? 'secondary.main' : 'text.secondary',
                  }}
                />
                <Divider orientation="vertical" flexItem sx={{ height: 24, my: 'auto' }} />
                <Button
                  onClick={handleLogout}
                  sx={{
                    color: 'text.primary',
                    fontWeight: 500,
                    '&:hover': {
                      color: 'error.main',
                      backgroundColor: 'rgba(239, 68, 68, 0.04)',
                    },
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  component={Link}
                  to="/login"
                  sx={{
                    color: 'text.primary',
                    fontWeight: 500,
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: 'rgba(37, 99, 235, 0.04)',
                    },
                  }}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  sx={{
                    fontWeight: 500,
                    boxShadow: 'none',
                    '&:hover': {
                      boxShadow: 'none',
                    },
                  }}
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 