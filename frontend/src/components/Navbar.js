import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Divider,
  Chip,
  useScrollTrigger,
  Slide,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Badge,
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Code as CodeIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  Add as AddIcon,
  MenuBook as MenuBookIcon,
  AccountCircle as AccountCircleIcon,
  ListAlt as ListAltIcon,
} from '@mui/icons-material';
import authService from '../services/auth.service';

// Hide on Scroll
function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getCurrentUser();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    authService.logout();
    navigate('/login');
  };

  const isCurrentPath = (path) => {
    return location.pathname === path;
  };

  return (
    <HideOnScroll>
    <AppBar 
      position="fixed" 
      sx={{ 
        backgroundColor: 'background.paper',
        backdropFilter: 'blur(8px)',
        background: (theme) => theme.palette.mode === 'dark' 
          ? 'rgba(22, 28, 36, 0.8)'
          : 'rgba(255, 255, 255, 0.8)',
        color: 'text.primary',
        boxShadow: (theme) => theme.palette.mode === 'dark'
          ? '0 2px 8px rgba(0, 0, 0, 0.15)'
          : '0 2px 8px rgba(0, 0, 0, 0.05)',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
      elevation={0}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: '70px' }}>
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
              mr: 4,
              position: 'relative',
              '&:hover': {
                '& .logo-icon': {
                  transform: 'rotate(20deg) scale(1.1)',
                },
                '& .logo-text': {
                  transform: 'translateY(-2px)',
                },
              },
            }}
          >
            <CodeIcon
              className="logo-icon"
              sx={{
                fontSize: '2.2rem',
                color: 'primary.main',
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
            <Typography
              className="logo-text"
              variant="h5"
              sx={{
                fontWeight: 800,
                letterSpacing: '-0.025em',
                background: (theme) => theme.palette.mode === 'dark'
                  ? 'linear-gradient(45deg, #60A5FA 30%, #A78BFA 90%)'
                  : 'linear-gradient(45deg, #2563eb 30%, #7c3aed 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              Algo
              <Box
                component="span"
                sx={{
                  color: (theme) => theme.palette.mode === 'dark' ? '#A78BFA' : '#7c3aed',
                  WebkitTextFillColor: (theme) => theme.palette.mode === 'dark' ? '#A78BFA' : '#7c3aed',
                  fontWeight: 900,
                }}
              >
                OJ
              </Box>
            </Typography>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexGrow: 1 }}>
            <Button
              component={Link}
              to="/"
              startIcon={<MenuBookIcon />}
              sx={{
                color: isCurrentPath('/') ? 'primary.main' : 'text.primary',
                fontWeight: 500,
                px: 2,
                py: 1,
                borderRadius: 2,
                position: 'relative',
                overflow: 'hidden',
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: isCurrentPath('/') ? '100%' : '0%',
                  height: '2px',
                  bgcolor: 'primary.main',
                  transition: 'width 0.3s ease',
                },
                '&:hover': {
                  backgroundColor: (theme) => theme.palette.mode === 'dark'
                    ? 'rgba(96, 165, 250, 0.08)'
                    : 'rgba(37, 99, 235, 0.04)',
                  '&:before': {
                    width: '100%',
                  },
                },
              }}
            >
              Problems
            </Button>

            {user && (
              <Button
                component={Link}
                to="/my-submissions"
                startIcon={<AssignmentIcon />}
                sx={{
                  color: isCurrentPath('/my-submissions') ? 'primary.main' : 'text.primary',
                  fontWeight: 500,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  position: 'relative',
                  overflow: 'hidden',
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: isCurrentPath('/my-submissions') ? '100%' : '0%',
                    height: '2px',
                    bgcolor: 'primary.main',
                    transition: 'width 0.3s ease',
                  },
                  '&:hover': {
                    backgroundColor: (theme) => theme.palette.mode === 'dark'
                      ? 'rgba(96, 165, 250, 0.08)'
                      : 'rgba(37, 99, 235, 0.04)',
                    '&:before': {
                      width: '100%',
                    },
                  },
                }}
              >
                My Submissions
              </Button>
            )}
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
                    backgroundColor: (theme) => user.role === 'admin' 
                      ? theme.palette.mode === 'dark'
                        ? 'rgba(167, 139, 250, 0.1)'
                        : 'rgba(124, 58, 237, 0.1)'
                      : theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.08)'
                        : 'rgba(0, 0, 0, 0.08)',
                    color: (theme) => user.role === 'admin'
                      ? theme.palette.mode === 'dark'
                        ? '#A78BFA'
                        : 'secondary.main'
                      : 'text.secondary',
                    borderRadius: '16px',
                    px: 1,
                  }}
                />
                <IconButton
                  onClick={handleMenu}
                  size="small"
                  sx={{
                    ml: 2,
                    border: '2px solid',
                    borderColor: (theme) => open 
                      ? theme.palette.mode === 'dark' ? '#60A5FA' : 'primary.main'
                      : 'divider',
                    transition: 'all 0.2s ease',
                    p: 0.5,
                    '&:hover': {
                      borderColor: (theme) => theme.palette.mode === 'dark' ? '#60A5FA' : 'primary.main',
                      transform: 'scale(1.05)',
                      '& .MuiAvatar-root': {
                        bgcolor: (theme) => theme.palette.mode === 'dark' ? '#60A5FA' : 'primary.main',
                        color: 'white',
                      },
                    },
                  }}
                >
                  <Avatar
                    sx={{ 
                      width: 35,
                      height: 35,
                      bgcolor: (theme) => open 
                        ? theme.palette.mode === 'dark' ? '#60A5FA' : 'primary.main'
                        : theme.palette.mode === 'dark' ? 'primary.dark' : 'primary.light',
                      color: 'white',
                      transition: 'all 0.2s ease',
                      border: '2px solid',
                      borderColor: 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <AccountCircleIcon sx={{ fontSize: 22 }} />
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  onClick={handleClose}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                      mt: 1.5,
                      borderRadius: 2,
                      backgroundColor: (theme) => theme.palette.mode === 'dark' 
                        ? 'background.paper'
                        : 'white',
                      '& .MuiMenuItem-root': {
                        color: 'text.primary',
                      },
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem component={Link} to="/profile">
                    <ListItemIcon>
                      <PersonIcon fontSize="small" sx={{ color: 'text.primary' }} />
                    </ListItemIcon>
                    Profile
                  </MenuItem>
                  {user.role === 'admin' && (
                    <>
                      <Divider />
                      <MenuItem component={Link} to="/admin">
                        <ListItemIcon>
                          <DashboardIcon fontSize="small" sx={{ color: 'text.primary' }} />
                        </ListItemIcon>
                        Admin Dashboard
                      </MenuItem>
                      <MenuItem component={Link} to="/admin/create-problem">
                        <ListItemIcon>
                          <AddIcon fontSize="small" sx={{ color: 'text.primary' }} />
                        </ListItemIcon>
                        Create Problem
                      </MenuItem>
                      <MenuItem component={Link} to="/admin/all-submissions">
                        <ListItemIcon>
                          <ListAltIcon fontSize="small" sx={{ color: 'text.primary' }} />
                        </ListItemIcon>
                        All Submissions
                      </MenuItem>
                    </>
                  )}
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <Typography color="error">Logout</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  component={Link}
                  to="/login"
                  sx={{
                    color: 'text.primary',
                    fontWeight: 500,
                    borderRadius: 2,
                    px: 3,
                    '&:hover': {
                      backgroundColor: (theme) => theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.08)'
                        : 'rgba(37, 99, 235, 0.04)',
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
                    borderRadius: 2,
                    px: 3,
                    boxShadow: 'none',
                    background: (theme) => theme.palette.mode === 'dark'
                      ? 'linear-gradient(45deg, #60A5FA 30%, #A78BFA 90%)'
                      : 'linear-gradient(45deg, #2563eb 30%, #7c3aed 90%)',
                    transition: 'transform 0.2s ease',
                    '&:hover': {
                      boxShadow: (theme) => theme.palette.mode === 'dark'
                        ? '0 4px 12px rgba(96, 165, 250, 0.2)'
                        : '0 4px 12px rgba(37, 99, 235, 0.2)',
                      transform: 'translateY(-1px)',
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
    </HideOnScroll>
  );
};

export default Navbar; 