import Project from "../models/Project.model.js";
import ProjectUpdate from "../models/ProjectUpdate.model.js";
import ProjectGallery from "../models/ProjectGallery.model.js";
import { Op } from "sequelize";
import path from "path";
import { fileURLToPath } from "url";

// Import models/index to ensure relationships are loaded
import "../models/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to get image URL from file path
const getImageUrl = (file) => {
  if (!file || !file.path) {
    throw new Error("File path is missing");
  }

  // Get relative path from uploads directory
  const relativePath = path.relative(
    path.join(__dirname, "../uploads"),
    file.path
  );
  // Convert backslashes to forward slashes for URL
  const urlPath = relativePath.replace(/\\/g, "/");

  // Return URL path (will be served as static file)
  return `/uploads/${urlPath}`;
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.findAll({
      order: [["created_at", "DESC"]],
      include: [
        {
          model: ProjectUpdate,
          as: "updates",
          required: false,
        },
        {
          model: ProjectGallery,
          as: "gallery",
          required: false,
        },
      ],
    });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Public
export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        {
          model: ProjectUpdate,
          as: "updates",
          required: false,
          order: [["update_date", "DESC"]],
        },
        {
          model: ProjectGallery,
          as: "gallery",
          required: false,
          order: [["display_order", "ASC"]],
        },
      ],
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create project
// @route   POST /api/projects
// @access  Private/Admin
export const createProject = async (req, res, next) => {
  try {
    let projectData = { ...req.body };

    // If image file is uploaded, get its URL
    if (req.file) {
      try {
        const imageUrl = getImageUrl(req.file);
        projectData.image_url = imageUrl;
      } catch (uploadError) {
        console.error("Image processing error:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Failed to process image",
          error: uploadError.message || "Unknown error",
        });
      }
    }

    const project = await Project.create(projectData);

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Admin
export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    let updateData = { ...req.body };

    // If image file is uploaded, get its URL
    if (req.file) {
      try {
        const imageUrl = getImageUrl(req.file);
        updateData.image_url = imageUrl;
      } catch (uploadError) {
        console.error("Image processing error:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Failed to process image",
          error: uploadError.message || "Unknown error",
        });
      }
    }

    await project.update(updateData);

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await project.destroy();

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add project update
// @route   POST /api/projects/:id/updates
// @access  Private/Admin
export const addProjectUpdate = async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const { title, content } = req.body;

    const update = await ProjectUpdate.create({
      project_id: project.id,
      title,
      content,
      update_date: new Date(),
    });

    res.status(201).json({
      success: true,
      data: update,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get project updates
// @route   GET /api/projects/:id/updates
// @access  Public
export const getProjectUpdates = async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const updates = await ProjectUpdate.findAll({
      where: { project_id: project.id },
      order: [["update_date", "DESC"]],
    });

    res.status(200).json({
      success: true,
      count: updates.length,
      data: updates,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add project gallery image
// @route   POST /api/projects/:id/gallery
// @access  Private/Admin
export const addProjectGalleryImage = async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    let imageUrl = req.body.image_url;
    const { caption, display_order } = req.body;

    // If image file is uploaded, get its URL
    if (req.file) {
      try {
        imageUrl = getImageUrl(req.file);
      } catch (uploadError) {
        console.error("Image processing error:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Failed to process image",
          error: uploadError.message || "Unknown error",
        });
      }
    }

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Image URL or image file is required",
      });
    }

    const galleryItem = await ProjectGallery.create({
      project_id: project.id,
      image_url: imageUrl,
      caption: caption || null,
      display_order: display_order || 0,
    });

    res.status(201).json({
      success: true,
      data: galleryItem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get project gallery
// @route   GET /api/projects/:id/gallery
// @access  Public
export const getProjectGallery = async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const gallery = await ProjectGallery.findAll({
      where: { project_id: project.id },
      order: [
        ["display_order", "ASC"],
        ["created_at", "ASC"],
      ],
    });

    res.status(200).json({
      success: true,
      count: gallery.length,
      data: gallery,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project gallery image
// @route   DELETE /api/projects/:id/gallery/:galleryId
// @access  Private/Admin
export const deleteProjectGalleryImage = async (req, res, next) => {
  try {
    const galleryItem = await ProjectGallery.findByPk(req.params.galleryId);

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: "Gallery image not found",
      });
    }

    await galleryItem.destroy();

    res.status(200).json({
      success: true,
      message: "Gallery image deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
