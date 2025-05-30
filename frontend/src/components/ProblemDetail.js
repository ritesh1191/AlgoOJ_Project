import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  AlertTitle,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import { toast } from 'react-toastify';
import './ProblemDetail.css';
import { runCode, submitAndEvaluate } from '../services/codeExecutionService';
import authService from '../services/auth.service';

const languageOptions = {
  python: {
    name: 'Python',
    extension: '.py',
    defaultCode: '# Write your Python code here\n\ndef solve():\n    # Your solution here\n    pass\n',
  },
  cpp: {
    name: 'C++',
    extension: '.cpp',
    defaultCode: '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Your solution here\n    return 0;\n}\n',
  },
  java: {
    name: 'Java',
    extension: '.java',
    defaultCode: 'public class Solution {\n    public static void main(String[] args) {\n        // Your solution here\n    }\n}\n',
  },
};

function ProblemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState(languageOptions.cpp.defaultCode);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [customOutput, setCustomOutput] = useState('');
  const [submissionResults, setSubmissionResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const user = authService.getCurrentUser();

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/problems/${id}`);
        setProblem(response.data);
        if (response.data.testCases && response.data.testCases.length > 0) {
          const visibleTestCase = response.data.testCases.find(tc => !tc.isHidden);
          if (visibleTestCase) {
            setCustomInput(visibleTestCase.input);
            setCustomOutput('');
          }
        }
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
      const result = await runCode(code, language, customInput);
      setCustomOutput(result.output);
      toast.success('Code executed successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to run code');
      setCustomOutput(error.message || 'Execution failed');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await submitAndEvaluate(code, language, problem.testCases);
      setSubmissionResults(result);
      setShowResults(true);
      
      if (result.success) {
        toast.success('All test cases passed!');
      } else {
        toast.error('Some test cases failed');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to submit code');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const ResultsDialog = () => (
    <Dialog 
      open={showResults} 
      onClose={() => setShowResults(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Submission Results
        {submissionResults?.success ? (
          <Alert severity="success" sx={{ mt: 1 }}>
            <AlertTitle>Success</AlertTitle>
            All test cases passed!
          </Alert>
        ) : (
          <Alert severity="error" sx={{ mt: 1 }}>
            <AlertTitle>Failed</AlertTitle>
            Some test cases failed
          </Alert>
        )}
      </DialogTitle>
      <DialogContent>
        {submissionResults?.results.map((result, index) => (
          <Card key={index} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" color={result.passed ? "success.main" : "error.main"}>
                Test Case {index + 1} {result.passed ? "✓" : "✗"}
              </Typography>
              {!result.isHidden && (
                <>
                  <Typography variant="subtitle2" color="text.secondary">Input:</Typography>
                  <pre>{result.input}</pre>
                  <Typography variant="subtitle2" color="text.secondary">Expected Output:</Typography>
                  <pre>{result.expectedOutput}</pre>
                  <Typography variant="subtitle2" color="text.secondary">Your Output:</Typography>
                  <pre>{result.actualOutput}</pre>
                </>
              )}
              {result.isHidden && (
                <Typography color="text.secondary">
                  This is a hidden test case. {result.passed ? "Your solution passed!" : "Your solution failed."}
                </Typography>
              )}
              {result.error && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {result.error}
                </Alert>
              )}
            </CardContent>
          </Card>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowResults(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );

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
              quickSuggestions: true,
              suggestOnTriggerCharacters: true,
              acceptSuggestionOnEnter: "on",
              tabCompletion: "on",
              wordBasedSuggestions: true,
              parameterHints: {
                enabled: true
              },
              suggest: {
                showKeywords: true,
                showSnippets: true,
                showClasses: true,
                showFunctions: true,
                showVariables: true,
                showWords: true,
                showMethods: true,
                showProperties: true
              }
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
          {!user ? (
            <Alert severity="info" action={
              <Button color="inherit" size="small" onClick={handleLoginRedirect}>
                Login
              </Button>
            }>
              Please login to run or submit your code
            </Alert>
          ) : null}
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <LoadingButton
              variant="contained"
              color="primary"
              onClick={handleRun}
              loading={isRunning}
              loadingPosition="start"
              startIcon={<PlayArrowIcon />}
              sx={{ minWidth: 120 }}
              disabled={!user}
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
              disabled={!user}
            >
              Submit
            </LoadingButton>
          </Box>

          <div className="custom-io-container">
            <div className="custom-input">
              <h4>Input:</h4>
              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Enter your input here..."
                rows={4}
                disabled={!user}
              />
            </div>
            <div className="custom-output">
              <h4>Output:</h4>
              <pre>{customOutput}</pre>
            </div>
          </div>
        </Box>
      </Box>
      <ResultsDialog />
    </Box>
  );
}

export default ProblemDetail; 