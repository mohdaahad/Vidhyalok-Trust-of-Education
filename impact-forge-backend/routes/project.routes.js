import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addProjectUpdate,
  getProjectUpdates,
  addProjectGalleryImage,
  getProjectGallery,
  deleteProjectGalleryImage,
} from "../controllers/project.controller.js";
import { protect, authorize } from "../middleware/auth.js";
import {
  createProjectValidation,
  updateProjectValidation,
  addProjectUpdateValidation,
  addProjectGalleryValidation,
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

// Get all projects
router.get("/", getProjects);

// Get project by ID
router.get("/:id", validateId("id"), getProjectById);

// Create project (admin only)
router.post(
  "/",
  protect,
  authorize("admin"),
  upload.single("image"), // Accept image file upload
  createProjectValidation,
  createProject
);

// Update project (admin only)
router.put(
  "/:id",
  protect,
  authorize("admin"),
  validateId("id"),
  upload.single("image"), // Accept image file upload
  updateProjectValidation,
  updateProject
);

// Delete project (admin only)
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  validateId("id"),
  deleteProject
);

// Add project update (admin only)
router.post(
  "/:id/updates",
  protect,
  authorize("admin"),
  validateId("id"),
  addProjectUpdateValidation,
  addProjectUpdate
);

// Get project updates
router.get("/:id/updates", validateId("id"), getProjectUpdates);

// Add project gallery image (admin only)
router.post(
  "/:id/gallery",
  protect,
  authorize("admin"),
  validateId("id"),
  upload.single("image"), // Accept image file upload
  addProjectGalleryValidation,
  addProjectGalleryImage
);

// Get project gallery
router.get("/:id/gallery", validateId("id"), getProjectGallery);

// Delete project gallery image (admin only)
router.delete(
  "/:id/gallery/:galleryId",
  protect,
  authorize("admin"),
  validateId("id"),
  validateId("galleryId"),
  deleteProjectGalleryImage
);

export default router;
