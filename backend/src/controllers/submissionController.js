const Submission = require('../models/Submission');

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
      memory
    } = req.body;

    // Log the received data
    console.log('Creating submission with data:', {
      userId: req.user.id,
      problemId,
      language,
      status,
      testCasesPassed,
      totalTestCases
    });

    // Validate required fields
    if (!problemId || !code || !language || !status) {
      return res.status(400).json({
        message: 'Missing required fields',
        required: ['problemId', 'code', 'language', 'status']
      });
    }

    const submission = new Submission({
      user: req.user.id,
      problem: problemId,
      code,
      language,
      status,
      testCasesPassed,
      totalTestCases,
      executionTime,
      memory
    });

    const savedSubmission = await submission.save();
    console.log('Submission saved successfully:', savedSubmission._id);

    // Populate the response with problem and user details
    const populatedSubmission = await Submission.findById(savedSubmission._id)
      .populate('problem', 'title difficulty')
      .populate('user', 'username');

    res.status(201).json(populatedSubmission);
  } catch (error) {
    console.error('Submission error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ message: 'Error creating submission', error: error.message });
  }
};

// Get submissions for a user
exports.getUserSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.user.id })
      .populate('problem', 'title difficulty')
      .sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ message: 'Error fetching submissions' });
  }
};

// Get submissions for a specific problem
exports.getProblemSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({
      user: req.user.id,
      problem: req.params.problemId
    })
      .populate('problem', 'title difficulty')
      .sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching problem submissions:', error);
    res.status(500).json({ message: 'Error fetching problem submissions' });
  }
};

// Get all submissions (admin only)
exports.getAllSubmissions = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const submissions = await Submission.find()
      .populate('problem', 'title difficulty')
      .populate('user', 'username')
      .sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching all submissions:', error);
    res.status(500).json({ message: 'Error fetching all submissions' });
  }
}; 