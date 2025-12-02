import express from "express";
import {
  getDashboardStats,
  getDonors,
  getTransactions,
  exportReports,
} from "../controllers/admin.controller.js";
import { adminLogin } from "../controllers/auth.controller.js";
import { protect, authorize } from "../middleware/auth.js";
import { loginValidation } from "../middleware/validation.js";

const router = express.Router();

// Admin login (public route - must be before protect middleware)
router.post("/login", loginValidation, adminLogin);

// All other admin routes require authentication and admin role
router.use(protect);
router.use(authorize("admin"));

// Dashboard stats
router.get("/dashboard", getDashboardStats);

// Get all donors
router.get("/donors", getDonors);

// Get all transactions
router.get("/transactions", getTransactions);

// Export reports
router.get("/reports/export", exportReports);

export default router;
