import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
} from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import submissionService from '../services/submission.service';
import { toast } from 'react-toastify';
import Editor from '@monaco-editor/react';

function MySubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const data = await submissionService.getUserSubmissions();
      setSubmissions(data);
    } catch (error) {
      toast.error('Failed to fetch submissions');
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCode = (submission) => {
    setSelectedSubmission(submission);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedSubmission(null);
  };

  const handleTryAgain = (submission) => {
    // Store the code in localStorage
    localStorage.setItem('savedCode', submission.code);
    localStorage.setItem('savedLanguage', submission.language.toLowerCase());
    
    // Navigate to the problem page
    navigate(`/problem/${submission.problem._id}`);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading submissions...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Submissions
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Problem</TableCell>
              <TableCell>Language</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Test Cases</TableCell>
              <TableCell>Submitted At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {submissions.map((submission) => (
              <TableRow key={submission._id}>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                    onClick={() => navigate(`/problems/${submission.problem._id}`)}
                  >
                    {submission.problem.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Difficulty: {submission.problem.difficulty}
                  </Typography>
                </TableCell>
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
                <TableCell>{formatDate(submission.submittedAt)}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleViewCode(submission)}
                    title="View Code"
                  >
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Submission Details
          <Typography variant="subtitle2" color="text.secondary">
            Problem: {selectedSubmission?.problem.title}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ height: '400px', mt: 2 }}>
            <Editor
              height="100%"
              language={selectedSubmission?.language.toLowerCase()}
              value={selectedSubmission?.code}
              theme="vs-dark"
              options={{
                readOnly: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false
              }}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2">
              Status: <Chip
                label={selectedSubmission?.status}
                color={getStatusColor(selectedSubmission?.status)}
                size="small"
              />
            </Typography>
            <Typography variant="subtitle2">
              Test Cases Passed: {selectedSubmission?.testCasesPassed}/{selectedSubmission?.totalTestCases}
            </Typography>
            <Typography variant="subtitle2">
              Submitted: {selectedSubmission && formatDate(selectedSubmission.submittedAt)}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Stack direction="row" spacing={2}>
            <Button onClick={handleCloseDialog}>Close</Button>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => handleTryAgain(selectedSubmission)}
            >
              Move to Editor
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default MySubmissions; 