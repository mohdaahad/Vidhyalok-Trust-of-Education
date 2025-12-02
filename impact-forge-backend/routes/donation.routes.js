import express from "express";
import {
  createDonation,
  getDonations,
  getAdminDonations,
  getDonationById,
  getMyDonations,
  verifyPayment,
  updateDonation,
  generateReceipt,
  generateTaxCertificate,
} from "../controllers/donation.controller.js";
import { protect, authorize } from "../middleware/auth.js";
import {
  createDonationValidation,
  validateId,
} from "../middleware/validation.js";

const router = express.Router();

// Get all donations (public stats - only completed)
router.get("/", getDonations);

// Get all donations (admin - all statuses)
router.get("/admin", protect, authorize("admin"), getAdminDonations);

// Get my donations
router.get("/my-donations", protect, getMyDonations);

// Get donation by ID
router.get("/:id", validateId("id"), getDonationById);

// Create donation
router.post("/", createDonationValidation, createDonation);

// Verify payment
router.post("/verify-payment", verifyPayment);

// Update donation (admin only)
router.put("/:id", protect, authorize("admin"), validateId("id"), updateDonation);

// Generate receipt
router.get("/:id/receipt", protect, validateId("id"), generateReceipt);

// Generate tax certificate
router.get(
  "/:id/tax-certificate",
  protect,
  validateId("id"),
  generateTaxCertificate
);

export default router;
