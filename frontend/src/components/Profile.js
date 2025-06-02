import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Chip,
  LinearProgress,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
} from '@mui/material';
import {
  CheckCircle as SolvedIcon,
  Timer as TimerIcon,
  Code as CodeIcon,
  TrendingUp as StatsIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import axios from 'axios';
import authService from '../services/auth.service';

const Profile = () => {
  const [stats, setStats] = useState({
    totalProblems: 0,
    solvedProblems: 0,
    submissions: [],
    problemsByDifficulty: {
      Easy: { total: 0, solved: 0 },
      Medium: { total: 0, solved: 0 },
      Hard: { total: 0, solved: 0 },
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = authService.getCurrentUser();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [problemsRes, submissionsRes] = await Promise.all([
          axios.get('http://localhost:5001/api/problems', {
            headers: { Authorization: `Bearer ${user.token}` }
          }),
          axios.get('http://localhost:5001/api/submissions/my-submissions', {
            headers: { Authorization: `Bearer ${user.token}` }
          })
        ]);

        const problems = problemsRes.data;
        const submissions = submissionsRes.data;

        // Get unique solved problems
        const solvedProblems = new Set(
          submissions
            .filter(sub => sub.status === 'Accepted')
            .map(sub => sub.problem._id)
        );

        // Calculate problems by difficulty
        const problemsByDifficulty = problems.reduce((acc, problem) => {
          if (!acc[problem.difficulty]) {
            acc[problem.difficulty] = { total: 0, solved: 0 };
          }
          acc[problem.difficulty].total += 1;
          if (solvedProblems.has(problem._id)) {
            acc[problem.difficulty].solved += 1;
          }
          return acc;
        }, {
          Easy: { total: 0, solved: 0 },
          Medium: { total: 0, solved: 0 },
          Hard: { total: 0, solved: 0 },
        });

        setStats({
          totalProblems: problems.length,
          solvedProblems: solvedProblems.size,
          submissions,
          problemsByDifficulty,
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProfileData();
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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return 'success';
      case 'wrong answer':
        return 'error';
      case 'time limit exceeded':
        return 'warning';
      default:
        return 'default';
    }
  };

  // Add a helper function to safely format dates
  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return format(date, 'MMM dd, yyyy HH:mm');
    } catch (error) {
      return 'N/A';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Profile Header */}
      <Paper elevation={1} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>
              {user.username}'s Profile
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Member since {formatDate(user.createdAt)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box display="flex" alignItems="center" gap={1}>
              <Chip
                icon={<CodeIcon />}
                label={`Role: ${user.role}`}
                color={user.role === 'admin' ? 'secondary' : 'default'}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card elevation={1} sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <SolvedIcon color="success" />
                <Typography variant="h6">Problem Solving</Typography>
              </Box>
              <Typography variant="h3" gutterBottom color="primary">
                {stats.solvedProblems}/{stats.totalProblems}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                problems solved
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(stats.solvedProblems / stats.totalProblems) * 100}
                sx={{ mt: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Difficulty Distribution */}
        <Grid item xs={12} md={8}>
          <Card elevation={1} sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={3}>
                <StatsIcon color="primary" />
                <Typography variant="h6">Difficulty Distribution</Typography>
              </Box>
              <Grid container spacing={2}>
                {Object.entries(stats.problemsByDifficulty).map(([difficulty, data]) => (
                  <Grid item xs={12} key={difficulty}>
                    <Box mb={1}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="body2" color="text.secondary">
                          {difficulty}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {data.solved}/{data.total}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(data.solved / (data.total || 1)) * 100}
                        color={getDifficultyColor(difficulty).toLowerCase()}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Submissions */}
      <Card elevation={1}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Submissions
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Problem</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Language</TableCell>
                  <TableCell>Runtime</TableCell>
                  <TableCell>Memory</TableCell>
                  <TableCell>Submitted</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stats.submissions.slice(0, 10).map((submission) => (
                  <TableRow key={submission._id} hover>
                    <TableCell>
                      <Typography color="primary">
                        {submission.problem?.title || 'Unknown Problem'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={submission.status || 'Unknown'}
                        size="small"
                        color={getStatusColor(submission.status)}
                      />
                    </TableCell>
                    <TableCell>{submission.language || 'N/A'}</TableCell>
                    <TableCell>{submission.executionTime ? `${submission.executionTime}ms` : 'N/A'}</TableCell>
                    <TableCell>{submission.memory ? `${submission.memory}KB` : 'N/A'}</TableCell>
                    <TableCell>
                      {formatDate(submission.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Profile; 