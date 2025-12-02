import ContactSubmission from "../models/ContactSubmission.model.js";
import { Op } from "sequelize";

// @desc    Get all contact submissions
// @route   GET /api/contacts
// @access  Private/Admin
export const getContactSubmissions = async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = status ? { status } : {};

    const submissions = await ContactSubmission.findAll({
      where,
      order: [["created_at", "DESC"]],
    });

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get contact submission by ID
// @route   GET /api/contacts/:id
// @access  Private/Admin
export const getContactSubmissionById = async (req, res, next) => {
  try {
    const submission = await ContactSubmission.findByPk(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Contact submission not found",
      });
    }

    res.status(200).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create contact submission
// @route   POST /api/contacts
// @access  Public
export const createContactSubmission = async (req, res, next) => {
  try {
    const submission = await ContactSubmission.create(req.body);

    res.status(201).json({
      success: true,
      message: "Thank you for contacting us. We will get back to you soon!",
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update contact submission status
// @route   PUT /api/contacts/:id
// @access  Private/Admin
export const updateContactSubmission = async (req, res, next) => {
  try {
    const submission = await ContactSubmission.findByPk(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Contact submission not found",
      });
    }

    await submission.update(req.body);

    res.status(200).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete contact submission
// @route   DELETE /api/contacts/:id
// @access  Private/Admin
export const deleteContactSubmission = async (req, res, next) => {
  try {
    const submission = await ContactSubmission.findByPk(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Contact submission not found",
      });
    }

    await submission.destroy();

    res.status(200).json({
      success: true,
      message: "Contact submission deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};


