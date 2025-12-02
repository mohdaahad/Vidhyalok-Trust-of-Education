import express from "express";
import {
  register,
  login,
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.js";
import {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} from "../middleware/validation.js";

const router = express.Router();

// Register
router.post("/register", registerValidation, register);

// Login
router.post("/login", loginValidation, login);

// Get current user
router.get("/me", protect, getMe);

// Update profile
router.put("/profile", protect, updateProfile);

// Forgot password
router.post("/forgot-password", forgotPasswordValidation, forgotPassword);

// Reset password
router.put(
  "/reset-password/:resettoken",
  resetPasswordValidation,
  resetPassword
);

export default router;
