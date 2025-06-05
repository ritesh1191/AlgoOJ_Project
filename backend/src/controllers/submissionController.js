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
      .populate('problem', 'title difficulty description')
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