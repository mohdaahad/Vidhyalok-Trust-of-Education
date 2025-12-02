import express from "express";
import {
  getContactSubmissions,
  getContactSubmissionById,
  createContactSubmission,
  updateContactSubmission,
  deleteContactSubmission,
} from "../controllers/contact.controller.js";
import { protect, authorize } from "../middleware/auth.js";
import {
  contactSubmissionValidation,
  validateId,
} from "../middleware/validation.js";

const router = express.Router();

// Create contact submission (public)
router.post("/", contactSubmissionValidation, createContactSubmission);

// Get all contact submissions (admin only)
router.get("/", protect, authorize("admin"), getContactSubmissions);

// Get contact submission by ID (admin only)
router.get("/:id", protect, authorize("admin"), validateId("id"), getContactSubmissionById);

// Update contact submission (admin only)
router.put(
  "/:id",
  protect,
  authorize("admin"),
  validateId("id"),
  updateContactSubmission
);

// Delete contact submission (admin only)
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  validateId("id"),
  deleteContactSubmission
);

export default router;


