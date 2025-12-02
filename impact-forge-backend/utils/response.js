/**
 * Standard API Response Utility
 * Provides consistent response format across the application
 */

/**
 * Success Response
 * @param {Object} res - Express response object
 * @param {Object} data - Response data
 * @param {String} message - Success message
 * @param {Number} statusCode - HTTP status code (default: 200)
 */
export const successResponse = (
  res,
  data = null,
  message = "Success",
  statusCode = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Error Response
 * @param {Object} res - Express response object
 * @param {String} message - Error message
 * @param {Number} statusCode - HTTP status code (default: 400)
 * @param {Object} errors - Additional error details
 */
export const errorResponse = (
  res,
  message = "An error occurred",
  statusCode = 400,
  errors = null
) => {
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

/**
 * Validation Error Response
 * @param {Object} res - Express response object
 * @param {Array} errors - Validation errors array
 * @param {Number} statusCode - HTTP status code (default: 422)
 */
export const validationErrorResponse = (res, errors, statusCode = 422) => {
  return res.status(statusCode).json({
    success: false,
    message: "Validation failed",
    errors,
  });
};

/**
 * Not Found Response
 * @param {Object} res - Express response object
 * @param {String} resource - Resource name (e.g., "User", "Project")
 */
export const notFoundResponse = (res, resource = "Resource") => {
  return res.status(404).json({
    success: false,
    message: `${resource} not found`,
  });
};

/**
 * Unauthorized Response
 * @param {Object} res - Express response object
 * @param {String} message - Error message
 */
export const unauthorizedResponse = (res, message = "Unauthorized access") => {
  return res.status(401).json({
    success: false,
    message,
  });
};

/**
 * Forbidden Response
 * @param {Object} res - Express response object
 * @param {String} message - Error message
 */
export const forbiddenResponse = (res, message = "Forbidden") => {
  return res.status(403).json({
    success: false,
    message,
  });
};

/**
 * Server Error Response
 * @param {Object} res - Express response object
 * @param {String} message - Error message
 */
export const serverErrorResponse = (res, message = "Internal server error") => {
  return res.status(500).json({
    success: false,
    message,
  });
};

/**
 * Paginated Response
 * @param {Object} res - Express response object
 * @param {Array} data - Response data array
 * @param {Number} page - Current page number
 * @param {Number} limit - Items per page
 * @param {Number} total - Total number of items
 * @param {String} message - Success message
 */
export const paginatedResponse = (
  res,
  data,
  page = 1,
  limit = 10,
  total = 0,
  message = "Success"
) => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      hasNextPage,
      hasPrevPage,
    },
  });
};

