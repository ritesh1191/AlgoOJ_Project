const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const codeExecutionController = require('../controllers/codeExecutionController');

// Execute code
router.post('/execute', auth, codeExecutionController.executeCode);

// Evaluate submission
router.post('/evaluate', auth, codeExecutionController.evaluateSubmission);

module.exports = router; 