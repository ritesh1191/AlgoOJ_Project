const { validationResult } = require('express-validator');
const Problem = require('../models/Problem');

// Get all problems
exports.getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find().select('-testCases.hidden');
    res.json(problems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get problem by ID
exports.getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    res.json(problem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new problem (Admin only)
exports.createProblem = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description, difficulty, testCases } = req.body;

    const problem = new Problem({
      title,
      description,
      difficulty,
      testCases,
      createdBy: req.user.id
    });

    await problem.save();
    res.status(201).json(problem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update problem (Admin only)
exports.updateProblem = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description, difficulty, testCases } = req.body;

    let problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    problem.title = title;
    problem.description = description;
    problem.difficulty = difficulty;
    if (testCases) {
      problem.testCases = testCases;
    }

    await problem.save();
    res.json(problem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete problem (Admin only)
exports.deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findByIdAndDelete(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    res.json({ message: 'Problem deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}; 