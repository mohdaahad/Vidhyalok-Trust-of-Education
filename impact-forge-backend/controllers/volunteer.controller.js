import Volunteer from "../models/Volunteer.model.js";
import User from "../models/User.model.js";
import crypto from "crypto";

// @desc    Register as volunteer
// @route   POST /api/volunteers/register
// @access  Public
export const registerVolunteer = async (req, res, next) => {
  try {
    const volunteerData = req.body;

    // Check if volunteer already exists
    const existingVolunteer = await Volunteer.findOne({
      where: { email: volunteerData.email },
    });

    if (existingVolunteer) {
      return res.status(400).json({
        success: false,
        message: "Volunteer with this email already exists",
      });
    }

    // Find or create user
    let user = await User.findOne({
      where: { email: volunteerData.email },
    });

    let userId = null;

    if (!user) {
      // Generate a random password for the user
      const randomPassword = crypto.randomBytes(16).toString("hex");

      // Create new user with volunteer role
      user = await User.create({
        email: volunteerData.email,
        password_hash: randomPassword, // Will be hashed by the beforeSave hook
        role: "volunteer",
      });

      userId = user.id;
    } else {
      userId = user.id;

      // Update user role to volunteer if it's not already volunteer or admin
      if (user.role === "public" || user.role === "donor") {
        await user.update({ role: "volunteer" });
      }
    }

    // Create volunteer with user_id
    const volunteer = await Volunteer.create({
      ...volunteerData,
      user_id: userId,
    });

    res.status(201).json({
      success: true,
      message: "Volunteer registration successful",
      data: volunteer,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all volunteers
// @route   GET /api/volunteers
// @access  Private/Admin
export const getVolunteers = async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = status ? { status } : {};

    const volunteers = await Volunteer.findAll({
      where,
      include: [
        {
          model: User,
          as: "user",
          required: false,
          attributes: ["id", "email"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.status(200).json({
      success: true,
      count: volunteers.length,
      data: volunteers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get volunteer by ID
// @route   GET /api/volunteers/:id
// @access  Public
export const getVolunteerById = async (req, res, next) => {
  try {
    const volunteer = await Volunteer.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "user",
          required: false,
          attributes: ["id", "email"],
        },
      ],
    });

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteer not found",
      });
    }

    res.status(200).json({
      success: true,
      data: volunteer,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my volunteer profile
// @route   GET /api/volunteers/my-profile
// @access  Private
export const getMyVolunteerProfile = async (req, res, next) => {
  try {
    const volunteer = await Volunteer.findOne({
      where: { user_id: req.user.id },
      include: [
        {
          model: User,
          as: "user",
          required: false,
          attributes: ["id", "full_name", "email"],
        },
      ],
    });

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteer profile not found",
      });
    }

    res.status(200).json({
      success: true,
      data: volunteer,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update volunteer status
// @route   PUT /api/volunteers/:id/status
// @access  Private/Admin
export const updateVolunteerStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const volunteer = await Volunteer.findByPk(req.params.id);

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteer not found",
      });
    }

    await volunteer.update({ status });

    res.status(200).json({
      success: true,
      data: volunteer,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate volunteer certificate
// @route   GET /api/volunteers/:id/certificate
// @access  Private
export const generateCertificate = async (req, res, next) => {
  try {
    const volunteer = await Volunteer.findByPk(req.params.id);

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteer not found",
      });
    }

    // TODO: Generate PDF certificate using jsPDF
    res.status(200).json({
      success: true,
      message: "Certificate generation - to be implemented",
      data: volunteer,
    });
  } catch (error) {
    next(error);
  }
};
