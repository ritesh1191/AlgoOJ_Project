const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const submissionController = require('../controllers/submissionController');

// Create a new submission (requires authentication)
router.post('/', auth, submissionController.createSubmission);

// Get user's submissions (requires authentication)
router.get('/user', auth, submissionController.getUserSubmissions);

// Get submissions for a specific problem (requires authentication)
router.get('/problem/:problemId', auth, submissionController.getProblemSubmissions);

// Get all submissions (admin only)
router.get('/all', auth, submissionController.getAllSubmissions);

module.exports = router; 