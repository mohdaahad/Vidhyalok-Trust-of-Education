/**
 * Validation Utilities
 * Common validation functions for the application
 */

/**
 * Validate email format
 * @param {String} email - Email address to validate
 * @returns {Boolean} - True if valid, false otherwise
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (basic validation)
 * @param {String} phone - Phone number to validate
 * @returns {Boolean} - True if valid, false otherwise
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
};

/**
 * Validate PAN number (Indian PAN format)
 * @param {String} pan - PAN number to validate
 * @returns {Boolean} - True if valid, false otherwise
 */
export const isValidPAN = (pan) => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan);
};

/**
 * Validate UUID format
 * @param {String} uuid - UUID to validate
 * @returns {Boolean} - True if valid, false otherwise
 */
export const isValidUUID = (uuid) => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

/**
 * Validate MongoDB ObjectId
 * @param {String} id - ObjectId to validate
 * @returns {Boolean} - True if valid, false otherwise
 */
export const isValidObjectId = (id) => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
};

/**
 * Validate password strength
 * @param {String} password - Password to validate
 * @param {Object} options - Validation options
 * @returns {Object} - Validation result with isValid and errors
 */
export const validatePassword = (password, options = {}) => {
  const {
    minLength = 6,
    requireUppercase = false,
    requireLowercase = false,
    requireNumbers = false,
    requireSpecialChars = false,
  } = options;

  const errors = [];

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (requireNumbers && !/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Sanitize string input
 * @param {String} input - String to sanitize
 * @returns {String} - Sanitized string
 */
export const sanitizeString = (input) => {
  if (typeof input !== "string") return "";
  return input.trim().replace(/[<>]/g, "");
};

/**
 * Validate date range
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Boolean} - True if valid, false otherwise
 */
export const isValidDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return false;
  return new Date(startDate) < new Date(endDate);
};

/**
 * Validate amount (positive number)
 * @param {Number} amount - Amount to validate
 * @param {Number} minAmount - Minimum amount (default: 0)
 * @returns {Boolean} - True if valid, false otherwise
 */
export const isValidAmount = (amount, minAmount = 0) => {
  const num = Number(amount);
  return !isNaN(num) && num >= minAmount && isFinite(num);
};

/**
 * Validate URL format
 * @param {String} url - URL to validate
 * @returns {Boolean} - True if valid, false otherwise
 */
export const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate image URL format (must be valid URL and end with image extension)
 * @param {String} url - Image URL to validate
 * @param {Array} allowedExtensions - Allowed image extensions (default: common image formats)
 * @returns {Boolean} - True if valid, false otherwise
 */
export const isValidImageURL = (url, allowedExtensions = null) => {
  if (!url || typeof url !== "string") return false;
  
  // Default allowed image extensions
  const defaultExtensions = [
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".webp",
    ".svg",
    ".bmp",
    ".ico",
  ];
  
  const extensions = allowedExtensions || defaultExtensions;
  
  // Check if URL is valid
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname.toLowerCase();
    
    // Check if URL ends with allowed image extension
    const hasValidExtension = extensions.some((ext) =>
      pathname.endsWith(ext.toLowerCase())
    );
    
    // Also check for query parameters (e.g., ?v=123, &format=png)
    // Some CDNs use query params for format
    if (!hasValidExtension) {
      // Check if URL contains image format in query string
      const hasImageFormat = urlObj.searchParams.has("format") || 
                            urlObj.searchParams.has("f") ||
                            pathname.includes("/image/") ||
                            pathname.includes("/img/");
      
      // If no extension but has image-related path, still allow (e.g., Cloudinary URLs)
      if (hasImageFormat || url.includes("cloudinary") || url.includes("image")) {
        return true;
      }
    }
    
    return hasValidExtension;
  } catch {
    return false;
  }
};

/**
 * Validate enum value
 * @param {String} value - Value to validate
 * @param {Array} allowedValues - Array of allowed values
 * @returns {Boolean} - True if valid, false otherwise
 */
export const isValidEnum = (value, allowedValues) => {
  return allowedValues.includes(value);
};

/**
 * Validate array
 * @param {Array} arr - Array to validate
 * @param {Number} minLength - Minimum length (default: 0)
 * @param {Number} maxLength - Maximum length (optional)
 * @returns {Boolean} - True if valid, false otherwise
 */
export const isValidArray = (arr, minLength = 0, maxLength = null) => {
  if (!Array.isArray(arr)) return false;
  if (arr.length < minLength) return false;
  if (maxLength !== null && arr.length > maxLength) return false;
  return true;
};

/**
 * Generate transaction ID
 * @returns {String} - Unique transaction ID
 */
export const generateTransactionId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `TXN_${timestamp}_${random}`.toUpperCase();
};

