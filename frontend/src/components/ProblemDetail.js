import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import { toast } from 'react-toastify';

const languageOptions = {
  python: {
    name: 'Python',
    extension: '.py',
    defaultCode: '# Write your Python code here\n\ndef solve():\n    # Your solution here\n    pass\n',
  },
  cpp: {
    name: 'C++',
    extension: '.cpp',
    defaultCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your solution here\n    return 0;\n}\n',
  },
  java: {
    name: 'Java',
    extension: '.java',
    defaultCode: 'public class Solution {\n    public static void main(String[] args) {\n        // Your solution here\n    }\n}\n',
  },
};

function ProblemDetail() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(languageOptions.python.defaultCode);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [output, setOutput] = useState('');

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/problems/${id}`);
        setProblem(response.data);
      } catch (error) {
        toast.error('Failed to load problem details');
        console.error('Error fetching problem:', error);
      }
    };
    fetchProblem();
  }, [id]);

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    setLanguage(newLanguage);
    setCode(languageOptions[newLanguage].defaultCode);
  };

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const handleRun = async () => {
    setIsRunning(true);
    try {
      const response = await axios.post('http://localhost:5001/api/code/run', {
        code,
        language,
        problemId: id,
      });
      setOutput(response.data.output);
      toast.success('Code executed successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to run code');
      setOutput(error.response?.data?.error || 'Execution failed');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:5001/api/code/submit', {
        code,
        language,
        problemId: id,
      });
      toast.success(response.data.message);
      setOutput(response.data.output);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit code');
      setOutput(error.response?.data?.error || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!problem) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: 'calc(100vh - 64px)', display: 'flex' }}>
      {/* Problem Description Section */}
      <Box 
        sx={{ 
          width: '35%',
          height: '100%',
          overflow: 'auto',
          borderRight: 1,
          borderColor: 'divider',
          bgcolor: 'background.default',
          p: 4
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
          {problem.title}
        </Typography>
        
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.7 }}>
          {problem.description}
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Sample Test Cases
        </Typography>
        
        {problem.testCases?.map((testCase, index) => (
          !testCase.isHidden && (
            <Card 
              key={index} 
              variant="outlined" 
              sx={{ 
                mb: 2,
                boxShadow: 'none',
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Input:
                </Typography>
                <Box 
                  sx={{ 
                    p: 2,
                    bgcolor: 'grey.50',
                    borderRadius: 1,
                    mb: 2,
                    fontFamily: 'monospace',
                    fontSize: '0.875rem'
                  }}
                >
                  {testCase.input}
                </Box>
                
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Expected Output:
                </Typography>
                <Box 
                  sx={{ 
                    p: 2,
                    bgcolor: 'grey.50',
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    fontSize: '0.875rem'
                  }}
                >
                  {testCase.output}
                </Box>
              </CardContent>
            </Card>
          )
        ))}
      </Box>

      {/* Code Editor Section */}
      <Box 
        sx={{ 
          width: '65%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.paper'
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Language</InputLabel>
            <Select value={language} onChange={handleLanguageChange} label="Language">
              <MenuItem value="python">Python</MenuItem>
              <MenuItem value="cpp">C++</MenuItem>
              <MenuItem value="java">Java</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ flex: 1, position: 'relative' }}>
          <Editor
            height="100%"
            language={language}
            value={code}
            theme="vs-dark"
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 20 },
              lineNumbers: 'on',
            }}
          />
        </Box>

        <Box 
          sx={{ 
            p: 2,
            borderTop: 1,
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
        >
          <Box sx={{ display: 'flex', gap: 2 }}>
            <LoadingButton
              variant="contained"
              color="primary"
              onClick={handleRun}
              loading={isRunning}
              loadingPosition="start"
              startIcon={<PlayArrowIcon />}
              sx={{ minWidth: 120 }}
            >
              Run
            </LoadingButton>
            <LoadingButton
              variant="contained"
              color="secondary"
              onClick={handleSubmit}
              loading={isSubmitting}
              loadingPosition="start"
              startIcon={<SendIcon />}
              sx={{ minWidth: 120 }}
            >
              Submit
            </LoadingButton>
          </Box>

          {output && (
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                bgcolor: 'grey.50',
                maxHeight: '150px',
                overflow: 'auto'
              }}
            >
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Output:
              </Typography>
              <Box sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                {output}
              </Box>
            </Paper>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default ProblemDetail; 