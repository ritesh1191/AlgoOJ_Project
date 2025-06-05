const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const { check } = require('express-validator');
const problemController = require('../controllers/problemController');
const Problem = require('../models/Problem');

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

// Get all problems
router.get('/all', auth, async (req, res) => {
    try {
        const problems = await Problem.find().populate('createdBy', 'username');
        res.json(problems);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching problems', error: error.message });
    }
});

// Get single problem
router.get('/:id', auth, async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id).populate('createdBy', 'username');
        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }
        res.json(problem);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching problem', error: error.message });
    }
});

// Create problem (admin only)
router.post('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const problem = new Problem({
            ...req.body,
            createdBy: req.user.id
        });

        await problem.save();
        res.status(201).json(problem);
    } catch (error) {
        res.status(500).json({ message: 'Error creating problem', error: error.message });
    }
});

// Development only route to create a test problem
if (process.env.NODE_ENV === 'development') {
    router.post('/create-test', auth, async (req, res) => {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Access denied' });
            }

            const testProblem = new Problem({
                title: 'Two Sum',
                description: `Given an array of integers nums and an integer target, return indices of the two numbers in nums such that they add up to target.
                You may assume that each input would have exactly one solution, and you may not use the same element twice.
                You can return the answer in any order.`,
                difficulty: 'Easy',
                testCases: [
                    {
                        input: '2 7 11 15\n9',
                        expectedOutput: '0 1',
                        explanation: 'nums[0] + nums[1] = 2 + 7 = 9'
                    },
                    {
                        input: '3 2 4\n6',
                        expectedOutput: '1 2',
                        explanation: 'nums[1] + nums[2] = 2 + 4 = 6'
                    },
                    {
                        input: '3 3\n6',
                        expectedOutput: '0 1',
                        explanation: 'nums[0] + nums[1] = 3 + 3 = 6'
                    }
                ],
                createdBy: req.user.id
            });

            await testProblem.save();
            res.status(201).json({ message: 'Test problem created successfully', problem: testProblem });
        } catch (error) {
            res.status(500).json({ message: 'Error creating test problem', error: error.message });
        }
    });
}

module.exports = router; 