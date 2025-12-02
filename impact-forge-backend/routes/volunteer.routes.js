import express from "express";
import {
  registerVolunteer,
  getVolunteers,
  getVolunteerById,
  updateVolunteerStatus,
  generateCertificate,
  getMyVolunteerProfile,
} from "../controllers/volunteer.controller.js";
import { protect, authorize } from "../middleware/auth.js";
import {
  registerVolunteerValidation,
  validateId,
} from "../middleware/validation.js";

const router = express.Router();

// Register as volunteer
router.post("/register", registerVolunteerValidation, registerVolunteer);

// Get all volunteers (admin only)
router.get("/", protect, authorize("admin"), getVolunteers);

// Get my volunteer profile
router.get("/my-profile", protect, getMyVolunteerProfile);

// Get volunteer by ID
router.get("/:id", validateId("id"), getVolunteerById);

// Update volunteer status (admin only)
router.put(
  "/:id/status",
  protect,
  authorize("admin"),
  validateId("id"),
  updateVolunteerStatus
);

// Generate certificate
router.get("/:id/certificate", protect, validateId("id"), generateCertificate);

export default router;
