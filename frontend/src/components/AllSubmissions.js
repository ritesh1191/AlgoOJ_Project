import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  CircularProgress,
  Chip,
} from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';

const AllSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/submissions/all', {
          headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).token}`
          }
        });
        console.log('Response data:', response.data); // Debug log
        setSubmissions(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching submissions:', err); // Debug log
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        All Submissions
      </Typography>
      {submissions.length === 0 ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <Typography variant="h6" color="text.secondary">
            No submissions found
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Submission ID</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Problem</TableCell>
                <TableCell>Language</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Memory</TableCell>
                <TableCell>Submitted At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission._id}>
                  <TableCell>{submission._id}</TableCell>
                  <TableCell>{submission.user?.username || 'Unknown User'}</TableCell>
                  <TableCell>{submission.problem?.title || 'Unknown Problem'}</TableCell>
                  <TableCell>{submission.language}</TableCell>
                  <TableCell>
                    <Chip
                      label={submission.status || 'Unknown'}
                      color={getStatusColor(submission.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{submission.executionTime || 0}ms</TableCell>
                  <TableCell>{submission.memory || 0}KB</TableCell>
                  <TableCell>
                    {submission.createdAt ? 
                      format(new Date(submission.createdAt), 'MMM dd, yyyy HH:mm:ss')
                      : 'N/A'
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default AllSubmissions; 