import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  getMyEvents,
  addEventAgenda,
  getEventAgenda,
  deleteEventAgenda,
  addEventGalleryImage,
  getEventGallery,
  deleteEventGalleryImage,
  addEventImpactMetric,
  getEventImpactMetrics,
  deleteEventImpactMetric,
  addEventTestimonial,
  getEventTestimonials,
  deleteEventTestimonial,
  updateEventRegistrationStatus,
} from "../controllers/event.controller.js";
import { protect, authorize } from "../middleware/auth.js";
import {
  createEventValidation,
  updateEventValidation,
  registerForEventValidation,
  addEventGalleryValidation,
  validateId,
} from "../middleware/validation.js";

const router = express.Router();

// Configure multer for file uploads - save to disk
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../uploads/images");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-random-originalname
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// Get all events
router.get("/", getEvents);

// Get my events
router.get("/my-events", protect, getMyEvents);

// Get event by ID
router.get("/:id", validateId("id"), getEventById);

// Register for event
router.post(
  "/:id/register",
  protect,
  validateId("id"),
  registerForEventValidation,
  registerForEvent
);

// Create event (admin only)
router.post(
  "/",
  protect,
  authorize("admin"),
  upload.single("image"), // Accept image file upload
  createEventValidation,
  createEvent
);

// Update event (admin only)
router.put(
  "/:id",
  protect,
  authorize("admin"),
  validateId("id"),
  upload.single("image"), // Accept image file upload
  updateEventValidation,
  updateEvent
);

// Delete event (admin only)
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  validateId("id"),
  deleteEvent
);

// Event Agenda Routes
router.post(
  "/:id/agenda",
  protect,
  authorize("admin"),
  validateId("id"),
  addEventAgenda
);

router.get("/:id/agenda", validateId("id"), getEventAgenda);

router.delete(
  "/:id/agenda/:agendaId",
  protect,
  authorize("admin"),
  validateId("id"),
  validateId("agendaId"),
  deleteEventAgenda
);

// Event Gallery Routes
router.post(
  "/:id/gallery",
  protect,
  authorize("admin"),
  validateId("id"),
  upload.single("image"), // Accept image file upload
  addEventGalleryValidation,
  addEventGalleryImage
);

router.get("/:id/gallery", validateId("id"), getEventGallery);

router.delete(
  "/:id/gallery/:galleryId",
  protect,
  authorize("admin"),
  validateId("id"),
  validateId("galleryId"),
  deleteEventGalleryImage
);

// Event Impact Metrics Routes
router.post(
  "/:id/impact-metrics",
  protect,
  authorize("admin"),
  validateId("id"),
  addEventImpactMetric
);

router.get("/:id/impact-metrics", validateId("id"), getEventImpactMetrics);

router.delete(
  "/:id/impact-metrics/:metricId",
  protect,
  authorize("admin"),
  validateId("id"),
  validateId("metricId"),
  deleteEventImpactMetric
);

// Event Testimonials Routes
router.post(
  "/:id/testimonials",
  protect,
  authorize("admin"),
  validateId("id"),
  addEventTestimonial
);

router.get("/:id/testimonials", validateId("id"), getEventTestimonials);

router.delete(
  "/:id/testimonials/:testimonialId",
  protect,
  authorize("admin"),
  validateId("id"),
  validateId("testimonialId"),
  deleteEventTestimonial
);

// Update event registration status (admin only)
router.put(
  "/:id/registrations/:registrationId",
  protect,
  authorize("admin"),
  validateId("id"),
  validateId("registrationId"),
  updateEventRegistrationStatus
);

export default router;
