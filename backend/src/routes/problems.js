const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const { check } = require('express-validator');
const problemController = require('../controllers/problemController');

// Public routes (accessible by all users)
router.get('/', problemController.getAllProblems);
router.get('/:id', problemController.getProblemById);

// Admin only routes (protected)
router.post(
  '/',
  [
    auth,
    isAdmin,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('difficulty', 'Difficulty is required').isIn(['Easy', 'Medium', 'Hard']),
    ],
  ],
  problemController.createProblem
);

router.put(
  '/:id',
  [
    auth,
    isAdmin,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('difficulty', 'Difficulty is required').isIn(['Easy', 'Medium', 'Hard']),
    ],
  ],
  problemController.updateProblem
);

router.delete('/:id', [auth, isAdmin], problemController.deleteProblem);

module.exports = router; 