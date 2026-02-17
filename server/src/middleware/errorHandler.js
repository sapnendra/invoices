const { HTTP_STATUS } = require('../config/constants');
const { errorResponse } = require('../utils/responseFormatter');

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = err.message || 'Internal server error';

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = Object.values(err.errors)
      .map(e => e.message)
      .join(', ');
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = 'Invalid ID format';
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    const field = Object.keys(err.keyPattern)[0];
    message = `${field} already exists`;
  }

  // Custom errors (BusinessRuleError, NotFoundError, etc.)
  if (err.statusCode) {
    statusCode = err.statusCode;
  }

  res.status(statusCode).json(errorResponse(message, statusCode));
};

module.exports = errorHandler;
