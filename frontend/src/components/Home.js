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
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { 
  CheckCircle as CheckCircleIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import problemService from '../services/problem.service';
import axios from 'axios';
import authService from '../services/auth.service';

const Home = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [solvedProblems, setSolvedProblems] = useState(new Set());
  const user = authService.getCurrentUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch problems and submissions in parallel
        const [problemsRes, submissionsRes] = await Promise.all([
          problemService.getProblems(),
          axios.get('http://localhost:5001/api/submissions/my-submissions', {
            headers: { Authorization: `Bearer ${user.token}` }
          })
        ]);

        // Create a set of solved problem IDs
        const solvedProblemIds = new Set(
          submissionsRes.data
            .filter(sub => sub.status === 'Accepted')
            .map(sub => sub.problem._id)
        );

        setSolvedProblems(solvedProblemIds);
        setProblems(problemsRes);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, [user.token]);

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

  const handleDifficultyFilterChange = (event) => {
    setDifficultyFilter(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredProblems = problems.filter(problem => {
    const matchesDifficulty = difficultyFilter === 'all' ? true : problem.difficulty === difficultyFilter;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === '' ? true : 
      problem.title.toLowerCase().includes(searchLower) || 
      problem.description.toLowerCase().includes(searchLower);
    return matchesDifficulty && matchesSearch;
  });

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
        <Box sx={{ mb: 6 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(45deg, #2563eb 30%, #7c3aed 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Problem Set
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              Solve coding problems to improve your algorithmic skills
            </Typography>

            {/* Motivational Section */}
            <Box 
              sx={{ 
                display: 'flex', 
                gap: 3, 
                justifyContent: 'center',
                mb: 4,
                flexWrap: 'wrap'
              }}
            >
              <Card 
                elevation={0} 
                sx={{ 
                  maxWidth: 280,
                  bgcolor: 'rgba(37, 99, 235, 0.04)',
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
                    Practice Makes Perfect
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Consistent practice is the key to mastering algorithms. Each problem you solve makes you stronger.
                  </Typography>
                </CardContent>
              </Card>

              <Card 
                elevation={0} 
                sx={{ 
                  maxWidth: 280,
                  bgcolor: 'rgba(124, 58, 237, 0.04)',
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <CardContent>
                  <Typography variant="h6" color="secondary" gutterBottom sx={{ fontWeight: 600 }}>
                    Challenge Yourself
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Step out of your comfort zone. Every difficult problem you tackle is a step toward growth.
                  </Typography>
                </CardContent>
              </Card>

              <Card 
                elevation={0} 
                sx={{ 
                  maxWidth: 280,
                  bgcolor: 'rgba(16, 185, 129, 0.04)',
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <CardContent>
                  <Typography variant="h6" color="success.main" gutterBottom sx={{ fontWeight: 600 }}>
                    Build Your Future
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Strong problem-solving skills are essential for a successful tech career. Start building yours today.
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            {/* Stats Section */}
            <Box 
              sx={{ 
                display: 'flex',
                justifyContent: 'center',
                gap: 4,
                mb: 4,
                flexWrap: 'wrap'
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary.main" sx={{ fontWeight: 700 }}>
                  {problems.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Problems
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main" sx={{ fontWeight: 700 }}>
                  {problems.filter(p => p.difficulty === 'Easy').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Easy Problems
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="warning.main" sx={{ fontWeight: 700 }}>
                  {problems.filter(p => p.difficulty === 'Medium').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Medium Problems
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="error.main" sx={{ fontWeight: 700 }}>
                  {problems.filter(p => p.difficulty === 'Hard').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Hard Problems
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Filters Section */}
          <Box 
            sx={{ 
              mb: 4,
              display: 'flex',
              gap: 3,
              alignItems: 'center',
              flexDirection: { xs: 'column', md: 'row' }
            }}
          >
            <TextField
              placeholder="Search problems by title or description..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
                flexGrow: 1,
                width: { xs: '100%', md: 'auto' }
              }}
            />
            <FormControl sx={{ minWidth: { xs: '100%', md: '200px' } }}>
              <InputLabel id="difficulty-filter-label">Difficulty</InputLabel>
              <Select
                labelId="difficulty-filter-label"
                value={difficultyFilter}
                onChange={handleDifficultyFilterChange}
                label="Difficulty"
                sx={{ 
                  borderRadius: 2,
                  height: '56px' // Match TextField height
                }}
              >
                <MenuItem value="all">All Difficulties</MenuItem>
                <MenuItem value="Easy">Easy</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Hard">Hard</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {filteredProblems.length === 0 ? (
          <Card elevation={1} sx={{ borderRadius: 2, textAlign: 'center', py: 6 }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary">
                {problems.length === 0 ? 'No problems available yet. Check back later!' : 'No problems match the selected filter.'}
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
                    Status
                  </TableCell>
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
                      width: '50%',
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
                {filteredProblems.map((problem, index) => (
                  <TableRow
                    key={problem._id}
                    hover
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        backgroundColor: 'rgba(37, 99, 235, 0.04)',
                        transform: 'translateY(-1px)',
                      },
                    }}
                    onClick={() => window.location.href = `/problem/${problem._id}`}
                  >
                    <TableCell>
                      {solvedProblems.has(problem._id) && (
                        <CheckCircleIcon
                          sx={{
                            color: 'success.main',
                            fontSize: '1.2rem'
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 500 }}>
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <Typography 
                        sx={{ 
                          color: 'primary.main',
                          fontWeight: 500,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
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