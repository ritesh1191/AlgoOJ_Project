const express = require('express');
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Register route
router.post(
  '/register',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('username', 'Username must be at least 3 characters long').isLength({ min: 3 }),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters long').isLength({ min: 6 })
  ],
  authController.register
);

// Login route
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  authController.login
);

// Get current user route
router.get('/me', auth, authController.getCurrentUser);

// Development only route to create admin user
if (process.env.NODE_ENV === 'development') {
    router.post('/create-admin', async (req, res) => {
        try {
            const adminUser = new User({
                username: 'admin',
                email: 'admin@algoj.com',
                password: 'admin123',
                role: 'admin'
            });

            await adminUser.save();
            res.status(201).json({ message: 'Admin user created successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error creating admin user', error: error.message });
        }
    });
}

module.exports = router; 