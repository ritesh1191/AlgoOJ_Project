const Submission = require('../models/submission');
const Problem = require('../models/problem');
const dockerRunner = require('../utils/dockerRunner');

// Create a new submission
exports.createSubmission = async (req, res) => {
  try {
    const {
      problemId,
      code,
      language,
      status,
      testCasesPassed,
      totalTestCases,
      executionTime,
      memoryUsed
    } = req.body;

    const submission = new Submission({
      user: req.user.id,
      problem: problemId,
      code,
      language,
      status,
      testCasesPassed,
      totalTestCases,
      executionTime,
      memoryUsed
    });

    await submission.save();
    res.status(201).json(submission);
  } catch (error) {
    console.error('Error creating submission:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all submissions for a user
exports.getUserSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.user.id })
      .populate('problem', 'title difficulty')
      .sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching user submissions:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all submissions for a specific problem
exports.getProblemSubmissions = async (req, res) => {
  try {
    const { problemId } = req.params;
    const submissions = await Submission.find({ problem: problemId })
      .populate('user', 'username')
      .sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching problem submissions:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get submission by ID
exports.getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('user', 'username')
      .populate('problem', 'title difficulty');
    
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Check if the user is authorized to view this submission
    if (submission.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this submission' });
    }

    res.json(submission);
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all submissions (admin only)
exports.getAllSubmissions = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized. Admin access required.' });
    }

    const submissions = await Submission.find()
      .populate({
        path: 'user',
        select: 'username'
      })
      .populate({
        path: 'problem',
        select: 'title difficulty'
      })
      .sort({ submittedAt: -1 });
    
    console.log('Submissions:', submissions); // Debug log
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching all submissions:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.submitSolution = async (req, res) => {
    try {
        const { problemId, code, language } = req.body;
        const userId = req.user.id;

        // Validate input
        if (!problemId || !code || !language) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Get problem details
        const problem = await Problem.findById(problemId);
        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }

        // Initialize Docker runner if not initialized
        await dockerRunner.initialize();

        let allTestsPassed = true;
        let testResults = [];

        // Run each test case
        for (const testCase of problem.testCases) {
            const result = await dockerRunner.runCode(code, language, testCase.input);
            
            const testPassed = result.success && 
                              result.output.trim() === testCase.expectedOutput.trim();
            
            testResults.push({
                input: testCase.input,
                expectedOutput: testCase.expectedOutput,
                actualOutput: result.output,
                passed: testPassed,
                error: result.error
            });

            if (!testPassed) {
                allTestsPassed = false;
            }
        }

        // Create submission record
        const submission = new Submission({
            user: userId,
            problem: problemId,
            code,
            language,
            status: allTestsPassed ? 'Accepted' : 'Wrong Answer',
            testResults
        });

        await submission.save();

        // Clean up Docker container
        await dockerRunner.stopContainer();

        return res.status(200).json({
            message: allTestsPassed ? 'All test cases passed!' : 'Some test cases failed',
            submission: {
                id: submission._id,
                status: submission.status,
                testResults
            }
        });

    } catch (error) {
        console.error('Submission error:', error);
        
        // Ensure Docker container is stopped in case of error
        await dockerRunner.stopContainer();
        
        return res.status(500).json({
            message: 'Error processing submission',
            error: error.message
        });
    }
};

exports.getSubmission = async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.id)
            .populate('problem', 'title')
            .populate('user', 'username');

        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        // Check if user has access to this submission
        if (submission.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json(submission);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving submission', error: error.message });
    }
}; 