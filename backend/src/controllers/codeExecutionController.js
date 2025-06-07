const { runCode } = require('../services/codeExecutionService');

exports.executeCode = async (req, res) => {
  try {
    const { code, language, input } = req.body;

    if (!code || !language) {
      return res.status(400).json({ message: 'Code and language are required' });
    }

    const output = await runCode(code, language, input);
    res.json({ output });
  } catch (error) {
    console.error('Code execution error:', error);
    res.status(500).json({ 
      message: error.message || 'Error executing code',
      error: error.toString()
    });
  }
};

exports.evaluateSubmission = async (req, res) => {
  try {
    const { code, language, testCases } = req.body;

    if (!code || !language || !testCases) {
      return res.status(400).json({ message: 'Code, language, and test cases are required' });
    }

    const results = [];
    let allTestsPassed = true;

    for (const testCase of testCases) {
      try {
        const output = await runCode(code, language, testCase.input);
        const passed = output.trim() === testCase.expectedOutput.trim();
        
        results.push({
          passed,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: output,
          error: null,
          isHidden: testCase.isHidden
        });

        if (!passed) allTestsPassed = false;
      } catch (error) {
        results.push({
          passed: false,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: '',
          error: error.message,
          isHidden: testCase.isHidden
        });
        allTestsPassed = false;
      }
    }

    res.json({
      success: allTestsPassed,
      results
    });
  } catch (error) {
    console.error('Submission evaluation error:', error);
    res.status(500).json({ 
      message: error.message || 'Error evaluating submission',
      error: error.toString()
    });
  }
}; 