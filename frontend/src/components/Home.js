import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { Link } from 'react-router-dom';
import problemService from '../services/problem.service';

const Home = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const data = await problemService.getProblems();
        setProblems(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch problems');
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'success';
      case 'Medium':
        return 'warning';
      case 'Hard':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={40} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Paper elevation={1} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
            <Typography color="error.main" variant="h6">
              {error}
            </Typography>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 6, mb: 6 }}>
        {/* Header Section */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(45deg, #2563eb 30%, #7c3aed 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            Coding Problems
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ 
              maxWidth: '600px', 
              mx: 'auto',
              mb: 4,
              fontWeight: 'normal'
            }}
          >
            Enhance your coding skills by solving algorithmic challenges
          </Typography>
        </Box>

        {problems.length === 0 ? (
          <Card elevation={1} sx={{ borderRadius: 2, textAlign: 'center', py: 6 }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary">
                No problems available yet. Check back later!
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell 
                    sx={{ 
                      fontWeight: 600, 
                      width: '10%',
                      fontSize: '0.95rem',
                      color: 'text.primary',
                      borderBottom: '2px solid rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    #
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontWeight: 600, 
                      width: '60%',
                      fontSize: '0.95rem',
                      color: 'text.primary',
                      borderBottom: '2px solid rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    Title
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontWeight: 600, 
                      width: '30%',
                      fontSize: '0.95rem',
                      color: 'text.primary',
                      borderBottom: '2px solid rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    Difficulty
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {problems.map((problem, index) => (
                  <TableRow
                    key={problem._id}
                    hover
                    component={Link}
                    to={`/problem/${problem._id}`}
                    sx={{
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                      '&:hover': {
                        backgroundColor: 'rgba(37, 99, 235, 0.04)',
                        transform: 'translateY(-1px)',
                      },
                    }}
                  >
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 500 }}>
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <Typography 
                        sx={{ 
                          color: 'primary.main',
                          fontWeight: 500,
                          '&:hover': {
                            color: 'primary.dark'
                          }
                        }}
                      >
                        {problem.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={problem.difficulty}
                        color={getDifficultyColor(problem.difficulty)}
                        size="small"
                        sx={{ 
                          minWidth: '80px',
                          fontWeight: 500,
                          fontSize: '0.85rem'
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Container>
  );
};

export default Home; 