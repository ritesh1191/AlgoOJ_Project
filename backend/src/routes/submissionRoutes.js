const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const submissionController = require('../controllers/submissionController');

// Create a new submission
router.post('/', auth, submissionController.createSubmission);

// Get all submissions (admin only)
router.get('/all', auth, submissionController.getAllSubmissions);

// Get all submissions for the logged-in user
router.get('/my-submissions', auth, submissionController.getUserSubmissions);

// Get all submissions for a specific problem
router.get('/problem/:problemId', auth, submissionController.getProblemSubmissions);

// Get submission by ID
router.get('/:id', auth, submissionController.getSubmissionById);

module.exports = router; 