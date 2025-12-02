import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// @desc    Upload image
// @route   POST /api/media/upload/image
// @access  Private/Admin
export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Convert buffer to stream
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'impact-forge/images',
        resource_type: 'image'
      },
      (error, result) => {
        if (error) {
          return res.status(500).json({
            success: false,
            message: 'Image upload failed',
            error: error.message
          });
        }

        res.status(200).json({
          success: true,
          data: {
            url: result.secure_url,
            public_id: result.public_id,
            width: result.width,
            height: result.height
          }
        });
      }
    );

    Readable.from(req.file.buffer).pipe(stream);
  } catch (error) {
    next(error);
  }
};

// @desc    Upload video
// @route   POST /api/media/upload/video
// @access  Private/Admin
export const uploadVideo = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Convert buffer to stream
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'impact-forge/videos',
        resource_type: 'video'
      },
      (error, result) => {
        if (error) {
          return res.status(500).json({
            success: false,
            message: 'Video upload failed',
            error: error.message
          });
        }

        res.status(200).json({
          success: true,
          data: {
            url: result.secure_url,
            public_id: result.public_id,
            duration: result.duration
          }
        });
      }
    );

    Readable.from(req.file.buffer).pipe(stream);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all media files
// @route   GET /api/media
// @access  Public
export const getMediaFiles = async (req, res, next) => {
  try {
    // TODO: Implement media file listing from Cloudinary or database
    res.status(200).json({
      success: true,
      message: 'Media listing - to be implemented',
      data: []
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete media file
// @route   DELETE /api/media/:id
// @access  Private/Admin
export const deleteMediaFile = async (req, res, next) => {
  try {
    const { id } = req.params;

    // TODO: Delete from Cloudinary and database
    res.status(200).json({
      success: true,
      message: 'Media deletion - to be implemented'
    });
  } catch (error) {
    next(error);
  }
};

