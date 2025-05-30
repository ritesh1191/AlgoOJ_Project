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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Visibility as VisibilityIcon, Search as SearchIcon } from '@mui/icons-material';
import axios from 'axios';
import { format } from 'date-fns';
import authService from '../services/auth.service';
import { toast } from 'react-toastify';
import Editor from '@monaco-editor/react';

const AdminSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAllSubmissions();
  }, []);

  useEffect(() => {
    filterSubmissions();
  }, [searchTerm, submissions]);

  const fetchAllSubmissions = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/submissions/all', {
        headers: {
          'Authorization': `Bearer ${authService.getCurrentUser()?.token}`
        }
      });
      setSubmissions(response.data);
      setFilteredSubmissions(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch submissions');
      setLoading(false);
    }
  };

  const filterSubmissions = () => {
    const filtered = submissions.filter(submission =>
      submission.problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSubmissions(filtered);
  };

  const handleViewSubmission = (submission) => {
    setSelectedSubmission(submission);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedSubmission(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted':
        return 'success';
      case 'Wrong Answer':
        return 'error';
      case 'Runtime Error':
        return 'warning';
      case 'Compilation Error':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          All Submissions
        </Typography>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by problem title, username, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {filteredSubmissions.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No submissions found.
            </Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Problem</TableCell>
                  <TableCell>Language</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Test Cases</TableCell>
                  <TableCell>Submitted At</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSubmissions.map((submission) => (
                  <TableRow key={submission._id}>
                    <TableCell>{submission.user.username}</TableCell>
                    <TableCell>{submission.problem.title}</TableCell>
                    <TableCell>{submission.language}</TableCell>
                    <TableCell>
                      <Chip
                        label={submission.status}
                        color={getStatusColor(submission.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {submission.testCasesPassed}/{submission.totalTestCases}
                    </TableCell>
                    <TableCell>
                      {format(new Date(submission.submittedAt), 'MMM dd, yyyy HH:mm:ss')}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => handleViewSubmission(submission)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Submission Details
          </DialogTitle>
          <DialogContent>
            {selectedSubmission && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  User: {selectedSubmission.user.username}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Problem: {selectedSubmission.problem.title}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  Submitted: {format(new Date(selectedSubmission.submittedAt), 'MMM dd, yyyy HH:mm:ss')}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Chip
                    label={`Status: ${selectedSubmission.status}`}
                    color={getStatusColor(selectedSubmission.status)}
                  />
                  <Chip
                    label={`Language: ${selectedSubmission.language}`}
                    color="primary"
                  />
                  <Chip
                    label={`Test Cases: ${selectedSubmission.testCasesPassed}/${selectedSubmission.totalTestCases}`}
                    color={selectedSubmission.testCasesPassed === selectedSubmission.totalTestCases ? 'success' : 'warning'}
                  />
                </Box>
                <Typography variant="subtitle2" gutterBottom>
                  Code:
                </Typography>
                <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}>
                  <Editor
                    height="300px"
                    language={selectedSubmission.language.toLowerCase()}
                    value={selectedSubmission.code}
                    theme="vs-dark"
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                    }}
                  />
                </Box>
                {selectedSubmission.executionTime > 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Execution Time: {selectedSubmission.executionTime}ms
                  </Typography>
                )}
                {selectedSubmission.memory > 0 && (
                  <Typography variant="body2" color="text.secondary">
                    Memory Used: {selectedSubmission.memory}KB
                  </Typography>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default AdminSubmissions; 