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
  Link,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  InputAdornment,
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { format } from 'date-fns';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const AllSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCode, setSelectedCode] = useState(null);
  const [codeDialogOpen, setCodeDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/submissions/all', {
          headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).token}`
          }
        });
        setSubmissions(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredSubmissions = submissions.filter(submission => {
    const searchLower = searchQuery.toLowerCase();
    return searchQuery === '' ? true : 
      (submission.problem?.title?.toLowerCase().includes(searchLower) || 
       submission.problem?.description?.toLowerCase().includes(searchLower));
  });

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

  const handleCodeClick = (code, language, problemId) => {
    setSelectedCode({ code, language, problemId });
    setCodeDialogOpen(true);
  };

  const handleCloseCodeDialog = () => {
    setCodeDialogOpen(false);
    setSelectedCode(null);
  };

  const handleMoveToEditor = () => {
    if (selectedCode) {
      // Store the code in localStorage
      localStorage.setItem('savedCode', selectedCode.code);
      localStorage.setItem('savedLanguage', selectedCode.language.toLowerCase());
      
      // Navigate to the problem page
      navigate(`/problem/${selectedCode.problemId}`);
    }
  };

  const getLanguageForPrism = (language) => {
    const languageMap = {
      'javascript': 'javascript',
      'python': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
    };
    return languageMap[language.toLowerCase()] || 'javascript';
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
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography variant="h4" gutterBottom>
          All Submissions
        </Typography>

        {/* Search Box */}
        <Box sx={{ maxWidth: '600px' }}>
          <TextField
            fullWidth
            placeholder="Search by problem title or description..."
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
            }}
          />
        </Box>

        {filteredSubmissions.length === 0 ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <Typography variant="h6" color="text.secondary">
              {submissions.length === 0 ? 'No submissions found' : 'No submissions match your search'}
            </Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 2 }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Problem</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Language</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Submitted At</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Code</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSubmissions.map((submission) => (
                  <TableRow 
                    key={submission._id}
                    hover
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(37, 99, 235, 0.04)',
                      },
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {submission.user?.username || 'Unknown User'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Link
                        component={RouterLink}
                        to={`/problem/${submission.problem?._id}`}
                        sx={{
                          color: 'primary.main',
                          textDecoration: 'none',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {submission.problem?.title || 'Unknown Problem'}
                      </Link>
                    </TableCell>
                    <TableCell>{submission.language}</TableCell>
                    <TableCell>
                      <Chip
                        label={submission.status || 'Unknown'}
                        color={getStatusColor(submission.status)}
                        size="small"
                        sx={{ minWidth: '90px' }}
                      />
                    </TableCell>
                    <TableCell>
                      {submission.createdAt ? 
                        format(new Date(submission.createdAt), 'MMM dd, yyyy HH:mm:ss')
                        : 'N/A'
                      }
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleCodeClick(submission.code, submission.language, submission.problem?._id)}
                        color="primary"
                        size="small"
                        title="View Code"
                      >
                        <CodeIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      <Dialog
        open={codeDialogOpen}
        onClose={handleCloseCodeDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: '90vh',
          },
        }}
      >
        <DialogTitle>
          Submitted Code
        </DialogTitle>
        <DialogContent>
          {selectedCode && (
            <Box sx={{ mt: 2 }}>
              <SyntaxHighlighter
                language={getLanguageForPrism(selectedCode.language)}
                style={materialDark}
                customStyle={{
                  margin: 0,
                  borderRadius: '4px',
                  maxHeight: '60vh',
                }}
              >
                {selectedCode.code}
              </SyntaxHighlighter>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Stack direction="row" spacing={2}>
            <Button onClick={handleCloseCodeDialog}>Close</Button>
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleMoveToEditor}
            >
              Move to Editor
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AllSubmissions; 