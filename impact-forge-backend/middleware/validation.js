import { body, param, query } from "express-validator";
import {
  isValidEmail,
  isValidPhone,
  isValidPAN,
  isValidAmount,
  isValidURL,
  isValidImageURL,
  isValidEnum,
  validatePassword,
} from "../utils/validation.js";

// Custom validators using validation utilities
export const validateEmail = (field = "email") => {
  return body(field)
    .notEmpty()
    .withMessage(`${field} is required`)
    .custom((value) => {
      if (!isValidEmail(value)) {
        throw new Error(`Please provide a valid ${field}`);
      }
      return true;
    });
};

export const validatePhone = (field = "phone") => {
  return body(field)
    .notEmpty()
    .withMessage(`${field} is required`)
    .custom((value) => {
      if (!isValidPhone(value)) {
        throw new Error(`Please provide a valid ${field}`);
      }
      return true;
    });
};

export const validatePAN = (field = "pan_number") => {
  return body(field)
    .optional()
    .custom((value) => {
      if (value && !isValidPAN(value)) {
        throw new Error(`Please provide a valid PAN number`);
      }
      return true;
    });
};

export const validateAmount = (field = "amount", minAmount = 1) => {
  return body(field)
    .notEmpty()
    .withMessage(`${field} is required`)
    .custom((value) => {
      if (!isValidAmount(value, minAmount)) {
        throw new Error(`${field} must be at least ${minAmount}`);
      }
      return true;
    });
};

export const validatePasswordField = (field = "password", options = {}) => {
  return body(field)
    .notEmpty()
    .withMessage(`${field} is required`)
    .custom((value) => {
      const result = validatePassword(value, options);
      if (!result.isValid) {
        throw new Error(result.errors.join(", "));
      }
      return true;
    });
};

export const validateURL = (field = "url") => {
  return body(field)
    .optional()
    .custom((value) => {
      if (value && !isValidURL(value)) {
        throw new Error(`Please provide a valid URL`);
      }
      return true;
    });
};

export const validateImageURL = (field = "image_url") => {
  return body(field)
    .optional()
    .custom((value) => {
      if (value && !isValidImageURL(value)) {
        throw new Error(
          `Please provide a valid image URL (PNG, JPG, JPEG, GIF, WEBP, SVG, BMP, or ICO format)`
        );
      }
      return true;
    });
};

export const validateEnum = (field, allowedValues, fieldName = field) => {
  return body(field)
    .notEmpty()
    .withMessage(`${fieldName} is required`)
    .custom((value) => {
      if (!isValidEnum(value, allowedValues)) {
        throw new Error(
          `${fieldName} must be one of: ${allowedValues.join(", ")}`
        );
      }
      return true;
    });
};

export const validateInteger = (field, min = null, max = null) => {
  return body(field)
    .optional()
    .custom((value) => {
      const num = parseInt(value, 10);
      if (isNaN(num)) {
        throw new Error(`${field} must be a valid integer`);
      }
      if (min !== null && num < min) {
        throw new Error(`${field} must be at least ${min}`);
      }
      if (max !== null && num > max) {
        throw new Error(`${field} must be at most ${max}`);
      }
      return true;
    });
};

export const validateDate = (field) => {
  return body(field)
    .optional()
    .custom((value) => {
      if (value && isNaN(Date.parse(value))) {
        throw new Error(`${field} must be a valid date`);
      }
      return true;
    });
};

// Auth route validators
export const registerValidation = [
  validateEmail("email"),
  validatePasswordField("password", { minLength: 6 }),
];

export const loginValidation = [
  validateEmail("email"),
  body("password").notEmpty().withMessage("Password is required"),
];

export const forgotPasswordValidation = [validateEmail("email")];

export const resetPasswordValidation = [
  validatePasswordField("password", { minLength: 6 }),
];

// Donation route validators
export const createDonationValidation = [
  validateAmount("amount", 1),
  validateEnum("donation_type", ["one-time", "monthly"], "Donation type"),
  validateEmail("donor_email"),
  body("donor_name").trim().notEmpty().withMessage("Donor name is required"),
  body("donor_phone")
    .optional()
    .custom((value) => {
      if (value && !isValidPhone(value)) {
        throw new Error("Please provide a valid phone number");
      }
      return true;
    }),
  validatePAN("pan_number"),
  body("payment_method")
    .optional()
    .custom((value) => {
      const allowed = ["razorpay", "bank-transfer", "cash", "other"];
      if (value && !isValidEnum(value, allowed)) {
        throw new Error(`Payment method must be one of: ${allowed.join(", ")}`);
      }
      return true;
    }),
];

// Volunteer route validators
export const registerVolunteerValidation = [
  body("first_name").trim().notEmpty().withMessage("First name is required"),
  body("last_name").trim().notEmpty().withMessage("Last name is required"),
  validateEmail("email"),
  validatePhone("phone"),
  body("city").trim().notEmpty().withMessage("City is required"),
  body("country").trim().notEmpty().withMessage("Country is required"),
  body("motivation").trim().notEmpty().withMessage("Motivation is required"),
  body("availability")
    .notEmpty()
    .withMessage("Availability is required")
    .custom((value) => {
      const allowed = ["weekdays", "weekends", "flexible", "remote"];
      if (!isValidEnum(value, allowed)) {
        throw new Error(`Availability must be one of: ${allowed.join(", ")}`);
      }
      return true;
    }),
  body("skills").optional().isArray().withMessage("Skills must be an array"),
  body("interests")
    .optional()
    .isArray()
    .withMessage("Interests must be an array")
    .custom((value) => {
      const allowed = [
        "Education",
        "Healthcare",
        "Environment",
        "Community Development",
        "Event Support",
        "Remote Work",
      ];
      if (value) {
        const invalid = value.filter((v) => !allowed.includes(v));
        if (invalid.length > 0) {
          throw new Error(`Invalid interests: ${invalid.join(", ")}`);
        }
      }
      return true;
    }),
];

// Project route validators
export const createProjectValidation = [
  body("title").trim().notEmpty().withMessage("Project title is required"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Project description is required"),
  validateEnum(
    "category",
    ["education", "healthcare", "water", "shelter", "environment", "community"],
    "Category"
  ),
  body("location").trim().notEmpty().withMessage("Location is required"),
  validateAmount("target_amount", 0),
  // image_url is optional - can be provided as URL or uploaded as file
  validateImageURL("image_url"),
  body("status")
    .optional()
    .custom((value) => {
      const allowed = ["draft", "active", "completed", "cancelled"];
      if (value && !isValidEnum(value, allowed)) {
        throw new Error(`Status must be one of: ${allowed.join(", ")}`);
      }
      return true;
    }),
  validateDate("start_date"),
  validateDate("end_date"),
];

export const updateProjectValidation = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty"),
  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty"),
  body("category")
    .optional()
    .custom((value) => {
      const allowed = [
        "education",
        "healthcare",
        "water",
        "shelter",
        "environment",
        "community",
      ];
      if (!isValidEnum(value, allowed)) {
        throw new Error(`Category must be one of: ${allowed.join(", ")}`);
      }
      return true;
    }),
  validateAmount("target_amount", 0).optional(),
  validateImageURL("image_url"),
];

export const addProjectUpdateValidation = [
  body("title").trim().notEmpty().withMessage("Update title is required"),
  body("content").trim().notEmpty().withMessage("Update content is required"),
];

export const addProjectGalleryValidation = [
  // image_url is optional - can be provided as URL or uploaded as file
  // Validation will be handled in controller (either file or URL must be present)
  body("image_url")
    .optional()
    .custom((value) => {
      if (value && !isValidImageURL(value)) {
        throw new Error(
          "Please provide a valid image URL (PNG, JPG, JPEG, GIF, WEBP, SVG, BMP, or ICO format)"
        );
      }
      return true;
    }),
  body("caption").optional().trim(),
  body("display_order")
    .optional()
    .custom((value) => {
      if (value !== undefined && value !== null) {
        const num = parseInt(value, 10);
        if (isNaN(num) || num < 0) {
          throw new Error("Display order must be a non-negative integer");
        }
      }
      return true;
    }),
];

// Event route validators
export const createEventValidation = [
  body("title").trim().notEmpty().withMessage("Event title is required"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Event description is required"),
  body("date")
    .notEmpty()
    .withMessage("Event date is required")
    .custom((value) => {
      if (isNaN(Date.parse(value))) {
        throw new Error("Event date must be a valid date");
      }
      return true;
    }),
  body("location").trim().notEmpty().withMessage("Location is required"),
  validateEnum(
    "category",
    ["Fundraiser", "Community", "Education", "Conference", "Workshop", "Other"],
    "Category"
  ),
  body("type")
    .optional()
    .custom((value) => {
      const allowed = ["fundraiser", "volunteer", "community", "conference"];
      if (value && !isValidEnum(value, allowed)) {
        throw new Error(`Event type must be one of: ${allowed.join(", ")}`);
      }
      return true;
    }),
  validateInteger("max_participants", 1).optional(),
  validateImageURL("image_url"),
  body("status")
    .optional()
    .custom((value) => {
      const allowed = ["upcoming", "ongoing", "completed", "cancelled"];
      if (value && !isValidEnum(value, allowed)) {
        throw new Error(`Status must be one of: ${allowed.join(", ")}`);
      }
      return true;
    }),
];

export const updateEventValidation = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty"),
  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty"),
  body("date")
    .optional()
    .custom((value) => {
      if (isNaN(Date.parse(value))) {
        throw new Error("Event date must be a valid date");
      }
      return true;
    }),
  validateImageURL("image_url"),
];

export const registerForEventValidation = [
  body("participant_name")
    .trim()
    .notEmpty()
    .withMessage("Participant name is required"),
  validateEmail("participant_email"),
  validatePhone("participant_phone"),
  validateInteger("number_of_guests", 1).optional(),
];

export const addEventGalleryValidation = [
  // image_url is optional - can be provided as URL or uploaded as file
  body("image_url")
    .optional()
    .custom((value) => {
      if (value && !isValidImageURL(value)) {
        throw new Error(
          "Please provide a valid image URL (PNG, JPG, JPEG, GIF, WEBP, SVG, BMP, or ICO format)"
        );
      }
      return true;
    }),
  body("caption").optional().trim(),
  body("display_order")
    .optional()
    .custom((value) => {
      if (value !== undefined && value !== null) {
        const num = parseInt(value, 10);
        if (isNaN(num) || num < 0) {
          throw new Error("Display order must be a non-negative integer");
        }
      }
      return true;
    }),
];

// Contact/Newsletter validators
export const contactSubmissionValidation = [
  body("first_name").trim().notEmpty().withMessage("First name is required"),
  body("last_name").trim().notEmpty().withMessage("Last name is required"),
  validateEmail("email"),
  body("phone")
    .optional()
    .custom((value) => {
      if (value && !isValidPhone(value)) {
        throw new Error("Please provide a valid phone number");
      }
      return true;
    }),
  body("subject").trim().notEmpty().withMessage("Subject is required"),
  body("message").trim().notEmpty().withMessage("Message is required"),
];

export const newsletterSubscriptionValidation = [validateEmail("email")];

// ID parameter validators
export const validateId = (paramName = "id") => {
  return param(paramName)
    .isInt({ min: 1 })
    .withMessage(`${paramName} must be a valid integer`);
};
