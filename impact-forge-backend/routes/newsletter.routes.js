import express from "express";
import {
  getNewsletterSubscriptions,
  getNewsletterSubscriptionById,
  subscribeToNewsletter,
  unsubscribeFromNewsletter,
  updateNewsletterSubscription,
  deleteNewsletterSubscription,
} from "../controllers/newsletter.controller.js";
import { protect, authorize } from "../middleware/auth.js";
import {
  newsletterSubscriptionValidation,
  validateId,
} from "../middleware/validation.js";

const router = express.Router();

// Subscribe to newsletter (public)
router.post("/subscribe", newsletterSubscriptionValidation, subscribeToNewsletter);

// Unsubscribe from newsletter (public)
router.post("/unsubscribe", newsletterSubscriptionValidation, unsubscribeFromNewsletter);

// Get all newsletter subscriptions (admin only)
router.get("/", protect, authorize("admin"), getNewsletterSubscriptions);

// Get newsletter subscription by ID (admin only)
router.get("/:id", protect, authorize("admin"), validateId("id"), getNewsletterSubscriptionById);

// Update newsletter subscription (admin only)
router.put(
  "/:id",
  protect,
  authorize("admin"),
  validateId("id"),
  updateNewsletterSubscription
);

// Delete newsletter subscription (admin only)
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  validateId("id"),
  deleteNewsletterSubscription
);

export default router;


