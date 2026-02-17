/**
 * Success response formatter
 */
const successResponse = (data, message = 'Success') => {
  return {
    success: true,
    message,
    data,
  };
};

/**
 * Error response formatter
 */
const errorResponse = (message, statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
    statusCode,
  };

  if (errors) {
    response.errors = errors;
  }

  return response;
};

module.exports = {
  successResponse,
  errorResponse,
};
