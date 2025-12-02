import express from 'express';
import multer from 'multer';
import {
  uploadImage,
  uploadVideo,
  getMediaFiles,
  deleteMediaFile
} from '../controllers/media.controller.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

// Upload image
router.post('/upload/image', protect, authorize('admin'), upload.single('image'), uploadImage);

// Upload video
router.post('/upload/video', protect, authorize('admin'), upload.single('video'), uploadVideo);

// Get all media files
router.get('/', getMediaFiles);

// Delete media file
router.delete('/:id', protect, authorize('admin'), deleteMediaFile);

export default router;

