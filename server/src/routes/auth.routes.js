const express = require('express');
const passport = require('../config/passport');

const router = express.Router();

/**
 * @route   GET /api/auth/google
 * @desc    Initiate Google OAuth
 * @access  Public
 */
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

/**
 * @route   GET /api/auth/google/callback
 * @desc    Google OAuth callback
 * @access  Public
 */
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL}/login?error=auth_failed`,
  }),
  (req, res) => {
    // Successful authentication, redirect to frontend
    res.redirect(`${process.env.CLIENT_URL}/?auth=success`);
  }
);

/**
 * @route   GET /api/auth/user
 * @desc    Get current user
 * @access  Private
 */
router.get('/user', (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({
      user: {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        picture: req.user.picture,
        lastLogin: req.user.lastLogin,
      },
    });
  }
  
  res.status(401).json({
    message: 'Not authenticated',
  });
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: {
          message: 'Logout failed',
          statusCode: 500,
        },
      });
    }
    
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
      }
      res.clearCookie('connect.sid');
      res.json({
        success: true,
        message: 'Logged out successfully',
      });
    });
  });
});

module.exports = router;
