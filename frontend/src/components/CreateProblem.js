import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  MenuItem,
  IconButton,
  Grid,
  FormControlLabel,
  Switch,
  Divider,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import toast from 'react-hot-toast';
import problemService from '../services/problem.service';

const CreateProblem = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'Easy',
    testCases: [
      {
        input: '',
        expectedOutput: '',
        explanation: '',
        isHidden: false,
      },
    ],
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
    const newTestCases = formData.testCases.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      testCases: newTestCases,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await problemService.createProblem(formData);
      toast.success('Problem created successfully!');
      navigate('/admin');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create problem';
      setError(message);
      toast.error(message);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Create New Problem
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              required
              label="Problem Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              margin="normal"
            />

            <TextField
              fullWidth
              required
              label="Problem Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={6}
              helperText="Use markdown for formatting. Include problem constraints, input/output format, and examples."
            />

            <TextField
              select
              fullWidth
              required
              label="Difficulty Level"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              margin="normal"
            >
              <MenuItem value="Easy">Easy</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Hard">Hard</MenuItem>
            </TextField>

            <Box sx={{ mt: 4, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Test Cases
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Add test cases to validate solutions. Hidden test cases are only used for validation and not shown to users.
              </Typography>
            </Box>

            {formData.testCases.map((testCase, index) => (
              <Paper
                key={index}
                variant="outlined"
                sx={{ p: 2, mb: 2, position: 'relative' }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      Test Case #{index + 1}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      required
                      label="Input"
                      value={testCase.input}
                      onChange={(e) =>
                        handleTestCaseChange(index, 'input', e.target.value)
                      }
                      multiline
                      rows={3}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      required
                      label="Expected Output"
                      value={testCase.expectedOutput}
                      onChange={(e) =>
                        handleTestCaseChange(index, 'expectedOutput', e.target.value)
                      }
                      multiline
                      rows={3}
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
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Switch
                            checked={testCase.isHidden}
                            onChange={(e) =>
                              handleTestCaseChange(
                                index,
                                'isHidden',
                                e.target.checked
                              )
                            }
                          />
                        }
                        label="Hidden Test Case"
                      />
                      {formData.testCases.length > 1 && (
                        <IconButton
                          color="error"
                          onClick={() => removeTestCase(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            ))}

            <Button
              startIcon={<AddIcon />}
              onClick={addTestCase}
              variant="outlined"
              sx={{ mb: 3 }}
            >
              Add Test Case
            </Button>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/admin')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                Create Problem
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default CreateProblem; 