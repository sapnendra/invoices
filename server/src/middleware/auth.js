/**
 * Middleware to check if user is authenticated
 */
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  
  return res.status(401).json({
    success: false,
    error: {
      message: 'Authentication required. Please log in.',
      statusCode: 401,
    },
  });
};

/**
 * Middleware to check authentication and return user info
 */
const checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    req.userInfo = {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
      picture: req.user.picture,
    };
  }
  next();
};

module.exports = {
  isAuthenticated,
  checkAuth,
};
