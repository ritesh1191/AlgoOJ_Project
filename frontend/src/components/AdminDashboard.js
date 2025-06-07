import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Grid,
  FormControlLabel,
  Switch,
  Divider,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import problemService from '../services/problem.service';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'Easy',
    testCases: [{ input: '', expectedOutput: '', explanation: '', isHidden: false }]
  });

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const data = await problemService.getProblems();
      setProblems(data);
    } catch (error) {
      toast.error('Failed to fetch problems');
    }
  };

  const handleOpen = (problem = null) => {
    if (problem) {
      setSelectedProblem(problem);
      setFormData({
        title: problem.title,
        description: problem.description,
        difficulty: problem.difficulty,
        testCases: problem.testCases
      });
    } else {
      setSelectedProblem(null);
      setFormData({
        title: '',
        description: '',
        difficulty: 'Easy',
        testCases: [{ input: '', expectedOutput: '', explanation: '', isHidden: false }]
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProblem(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedProblem) {
        await problemService.updateProblem(selectedProblem._id, formData);
        toast.success('Problem updated successfully');
      } else {
        await problemService.createProblem(formData);
        toast.success('Problem created successfully');
      }
      handleClose();
      fetchProblems();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this problem?')) {
      try {
        await problemService.deleteProblem(id);
        toast.success('Problem deleted successfully');
        fetchProblems();
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to delete problem';
        console.error('Delete error:', error);
        toast.error(errorMessage);
      }
    }
  };

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

  const handleTestCaseChange = (index, field, value) => {
    const newTestCases = [...formData.testCases];
    newTestCases[index] = {
      ...newTestCases[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      testCases: newTestCases,
    });
  };

  const addTestCase = () => {
    setFormData({
      ...formData,
      testCases: [
        ...formData.testCases,
        {
          input: '',
          expectedOutput: '',
          explanation: '',
          isHidden: false,
        },
      ],
    });
  };

  const removeTestCase = (index) => {
    if (formData.testCases.length > 1) {
      const newTestCases = formData.testCases.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        testCases: newTestCases,
      });
    } else {
      toast.error('At least one test case is required');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Problem Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/admin/create-problem')}
          >
            Create New Problem
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Difficulty</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {problems.map((problem) => (
                <TableRow key={problem._id}>
                  <TableCell>
                    <Typography
                      sx={{
                        cursor: 'pointer',
                        color: 'primary.main',
                        '&:hover': {
                          textDecoration: 'underline',
                          color: 'primary.dark'
                        }
                      }}
                      onClick={() => navigate(`/problem/${problem._id}`)}
                    >
                      {problem.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={problem.difficulty}
                      color={getDifficultyColor(problem.difficulty)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpen(problem)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(problem._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>
            {selectedProblem ? 'Edit Problem' : 'Create New Problem'}
          </DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                margin="normal"
                required
                multiline
                rows={4}
              />
              <TextField
                select
                fullWidth
                label="Difficulty"
                value={formData.difficulty}
                onChange={(e) =>
                  setFormData({ ...formData, difficulty: e.target.value })
                }
                margin="normal"
                required
              >
                <MenuItem value="Easy">Easy</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Hard">Hard</MenuItem>
              </TextField>

              <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                Test Cases
              </Typography>

              {formData.testCases.map((testCase, index) => (
                <Paper key={index} elevation={1} sx={{ p: 2, mb: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom>
                        Test Case {index + 1}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Input"
                        value={testCase.input}
                        onChange={(e) =>
                          handleTestCaseChange(index, 'input', e.target.value)
                        }
                        multiline
                        rows={2}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Expected Output"
                        value={testCase.expectedOutput}
                        onChange={(e) =>
                          handleTestCaseChange(index, 'expectedOutput', e.target.value)
                        }
                        multiline
                        rows={2}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Explanation"
                        value={testCase.explanation}
                        onChange={(e) =>
                          handleTestCaseChange(index, 'explanation', e.target.value)
                        }
                        multiline
                        rows={2}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={testCase.isHidden}
                              onChange={(e) =>
                                handleTestCaseChange(index, 'isHidden', e.target.checked)
                              }
                            />
                          }
                          label="Hidden Test Case"
                        />
                        <IconButton
                          color="error"
                          onClick={() => removeTestCase(index)}
                          disabled={formData.testCases.length === 1}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              ))}

              <Button
                startIcon={<AddIcon />}
                onClick={addTestCase}
                variant="outlined"
                sx={{ mt: 2, mb: 2 }}
              >
                Add Test Case
              </Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              {selectedProblem ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default AdminDashboard; 