import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Chip,
  Divider,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import problemService from '../services/problem.service';

const ProblemDetail = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const data = await problemService.getProblemById(id);
        setProblem(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch problem details');
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

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

  if (error || !problem) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Paper elevation={1} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
            <Typography color="error.main" variant="h6">
              {error || 'Problem not found'}
            </Typography>
          </Paper>
        </Box>
      </Container>
    );
  }

  // Filter out hidden test cases for non-admin users
  const visibleTestCases = problem.testCases.filter(testCase => !testCase.isHidden);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 6 }}>
        {/* Back Button */}
        <Button
          component={Link}
          to="/"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 4 }}
          color="inherit"
        >
          Back to Problems
        </Button>

        <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          {/* Problem Header */}
          <Box 
            sx={{ 
              p: 4, 
              background: 'linear-gradient(45deg, rgba(37, 99, 235, 0.03) 0%, rgba(124, 58, 237, 0.03) 100%)',
              borderBottom: '1px solid rgba(0, 0, 0, 0.06)'
            }}
          >
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 700,
                color: 'text.primary',
                mb: 2
              }}
            >
              {problem.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip
                label={problem.difficulty}
                color={getDifficultyColor(problem.difficulty)}
                sx={{ 
                  fontWeight: 500,
                  px: 1
                }}
              />
            </Box>
          </Box>

          {/* Problem Description */}
          <Box sx={{ p: 4 }}>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                fontWeight: 600,
                color: 'text.primary',
                mb: 2
              }}
            >
              Description
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                whiteSpace: 'pre-line',
                color: 'text.secondary',
                lineHeight: 1.7
              }}
            >
              {problem.description}
            </Typography>
          </Box>

          <Divider sx={{ mx: 4 }} />

          {/* Test Cases */}
          <Box sx={{ p: 4 }}>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                fontWeight: 600,
                color: 'text.primary',
                mb: 3
              }}
            >
              Example Test Cases
            </Typography>
            <Grid container spacing={3}>
              {visibleTestCases.map((testCase, index) => (
                <Grid item xs={12} key={index}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      borderRadius: 2,
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: 'primary.main',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }
                    }}
                  >
                    <CardContent>
                      <Typography 
                        variant="h6" 
                        color="primary" 
                        gutterBottom
                        sx={{ 
                          fontWeight: 600,
                          fontSize: '1.1rem',
                          mb: 2
                        }}
                      >
                        Test Case {index + 1}
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Typography 
                            variant="body2" 
                            component="div" 
                            sx={{ mb: 2 }}
                          >
                            <Box component="span" sx={{ fontWeight: 600, color: 'text.primary', mr: 1 }}>
                              Input:
                            </Box>
                            <Box component="span" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                              {testCase.input}
                            </Box>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography 
                            variant="body2" 
                            component="div" 
                            sx={{ mb: 2 }}
                          >
                            <Box component="span" sx={{ fontWeight: 600, color: 'text.primary', mr: 1 }}>
                              Output:
                            </Box>
                            <Box component="span" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                              {testCase.output}
                            </Box>
                          </Typography>
                        </Grid>
                      </Grid>
                      {testCase.explanation && (
                        <Typography variant="body2" component="div" sx={{ mt: 1 }}>
                          <Box component="span" sx={{ fontWeight: 600, color: 'text.primary', mr: 1 }}>
                            Explanation:
                          </Box>
                          <Box component="span" sx={{ color: 'text.secondary' }}>
                            {testCase.explanation}
                          </Box>
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ProblemDetail; 