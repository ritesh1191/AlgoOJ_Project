const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Accepted', 'Wrong Answer', 'Runtime Error', 'Compilation Error'],
    required: true
  },
  testCasesPassed: {
    type: Number,
    required: true,
    default: 0
  },
  totalTestCases: {
    type: Number,
    required: true,
    default: 0
  },
  testResults: [{
    input: String,
    expectedOutput: String,
    actualOutput: String,
    passed: Boolean,
    error: String
  }],
  executionTime: {
    type: Number,  // in milliseconds
    default: 0
  },
  memoryUsed: {
    type: Number,  // in bytes
    default: 0
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

// Check if the model already exists before compiling
module.exports = mongoose.models.Submission || mongoose.model('Submission', submissionSchema); 