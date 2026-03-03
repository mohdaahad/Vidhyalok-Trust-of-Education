import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import {
  createDonation,
  getDonations,
  getAdminDonations,
  getDonationById,
  getMyDonations,
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

// Configure multer for donation screenshot uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, "../uploads/donations");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// Get all donations (public stats - only completed)
router.get("/", getDonations);

// Get all donations (admin - all statuses)
router.get("/admin", protect, authorize("admin"), getAdminDonations);

// Get my donations
router.get("/my-donations", protect, getMyDonations);

// Get donation by ID
router.get("/:id", validateId("id"), getDonationById);

// Create donation (bank transfer with optional screenshot)
router.post("/", upload.single("payment_screenshot"), createDonationValidation, createDonation);

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
