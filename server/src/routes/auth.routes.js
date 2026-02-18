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
    // Log authentication status for debugging
    console.log('Auth callback - User authenticated:', req.isAuthenticated());
    console.log('Auth callback - Session ID:', req.sessionID);
    console.log('Auth callback - User ID:', req.user?._id);
    
    // Ensure session is saved before redirect
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.redirect(`${process.env.CLIENT_URL}/login?error=session_error`);
      }
      
      console.log('Session saved successfully');
      
      // Send HTML page that redirects to frontend
      // This ensures the cookie is set before the cross-origin navigation
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Authentication Successful</title>
            <meta charset="utf-8">
          </head>
          <body>
            <script>
              // Redirect to frontend after a brief delay to ensure cookie is set
              window.location.href = '${process.env.CLIENT_URL}/?auth=success';
            </script>
            <p>Authentication successful. Redirecting...</p>
          </body>
        </html>
      `);
    });
  }
);

/**
 * @route   GET /api/auth/user
 * @desc    Get current user
 * @access  Private
 */
router.get('/user', (req, res) => {
  // Debug logging
  console.log('GET /api/auth/user');
  console.log('Session ID:', req.sessionID);
  console.log('Session:', req.session);
  console.log('Is Authenticated:', req.isAuthenticated());
  console.log('User:', req.user);
  
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
