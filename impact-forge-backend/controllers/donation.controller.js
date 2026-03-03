import Donation from "../models/Donation.model.js";
import Project from "../models/Project.model.js";
import { Op } from "sequelize";
import { generateDonationReceiptBuffer } from "../utils/pdfGenerator.js";

// @desc    Create donation (bank transfer)
// @route   POST /api/donations
// @access  Public
export const createDonation = async (req, res, next) => {
  try {
    const {
      amount,
      donation_type,
      project_id,
      donor_name,
      donor_email,
      donor_phone,
      pan_number,
      is_anonymous,
      message,
      utr_number,
    } = req.body;

    // Generate unique transaction ID
    const transaction_id = `TXN${Date.now()}${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;

    // Handle uploaded screenshot
    let payment_screenshot = null;
    if (req.file) {
      payment_screenshot = `/uploads/donations/${req.file.filename}`;
    }

    // Create donation record with pending status (admin will mark as completed after verifying bank transfer)
    const donation = await Donation.create({
      transaction_id,
      amount,
      donation_type: donation_type || "one-time",
      project_id: project_id || null,
      donor_name,
      donor_email,
      donor_phone: donor_phone || null,
      pan_number: pan_number || null,
      is_anonymous: is_anonymous || false,
      message: message || null,
      utr_number: utr_number || null,
      payment_screenshot,
      status: "pending",
      payment_method: "bank-transfer",
    });



    res.status(201).json({
      success: true,
      data: {
        donation,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all donations
// @route   GET /api/donations
// @access  Public
export const getDonations = async (req, res, next) => {
  try {
    const { status, project_id } = req.query;
    const where = {};

    if (status) {
      where.status = status;
    } else {
      // Default: only show completed donations for public
      where.status = "completed";
    }

    if (project_id) {
      where.project_id = project_id;
    }

    const donations = await Donation.findAll({
      where,
      include: [
        {
          model: Project,
          as: "project",
          required: false,
          attributes: ["id", "title"],
        },
      ],
      order: [["created_at", "DESC"]],
      limit: 100,
    });

    // Mask anonymous donor details for public API
    const maskedDonations = donations.map((d) => {
      const donation = d.toJSON();
      if (donation.is_anonymous) {
        donation.donor_name = "Anonymous Donor";
        donation.donor_email = "***@***.com";
        donation.donor_phone = null;
      }
      return donation;
    });

    res.status(200).json({
      success: true,
      count: maskedDonations.length,
      data: maskedDonations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all donations (admin)
// @route   GET /api/donations/admin
// @access  Private/Admin
export const getAdminDonations = async (req, res, next) => {
  try {
    const { status, project_id } = req.query;
    const where = {};

    if (status) {
      where.status = status;
    }

    if (project_id) {
      where.project_id = project_id;
    }

    const donations = await Donation.findAll({
      where,
      include: [
        {
          model: Project,
          as: "project",
          required: false,
          attributes: ["id", "title"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.status(200).json({
      success: true,
      count: donations.length,
      data: donations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my donations
// @route   GET /api/donations/my-donations
// @access  Private
export const getMyDonations = async (req, res, next) => {
  try {
    const donations = await Donation.findAll({
      where: { donor_email: req.user?.email },
      include: [
        {
          model: Project,
          as: "project",
          required: false,
          attributes: ["id", "title"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.status(200).json({
      success: true,
      count: donations.length,
      data: donations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get donation by ID
// @route   GET /api/donations/:id
// @access  Public
export const getDonationById = async (req, res, next) => {
  try {
    const donation = await Donation.findByPk(req.params.id, {
      include: [
        {
          model: Project,
          as: "project",
          required: false,
          attributes: ["id", "title"],
        },
      ],
    });

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found",
      });
    }

    res.status(200).json({
      success: true,
      data: donation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update donation status (admin)
// @route   PUT /api/donations/:id
// @access  Private/Admin
export const updateDonation = async (req, res, next) => {
  try {
    const donation = await Donation.findByPk(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found",
      });
    }

    const previousStatus = donation.status;
    await donation.update(req.body);

    // Update project raised amount if status changed to completed
    if (
      previousStatus !== "completed" &&
      donation.status === "completed" &&
      donation.project_id
    ) {
      const project = await Project.findByPk(donation.project_id);
      if (project) {
        await project.increment("amount_raised", {
          by: parseFloat(donation.amount),
        });
      }
    }




    res.status(200).json({
      success: true,
      data: donation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate donation receipt
// @route   GET /api/donations/:id/receipt
// @access  Private
export const generateReceipt = async (req, res, next) => {
  try {
    const donation = await Donation.findByPk(req.params.id, {
      include: [
        {
          model: Project,
          as: "project",
          required: false,
        },
      ],
    });

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found",
      });
    }

    const pdfBuffer = generateDonationReceiptBuffer(donation);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=receipt-${donation.transaction_id}.pdf`
    );
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};

// @desc    Generate tax certificate
// @route   GET /api/donations/:id/tax-certificate
// @access  Private
export const generateTaxCertificate = async (req, res, next) => {
  try {
    const donation = await Donation.findByPk(req.params.id, {
      include: [
        {
          model: Project,
          as: "project",
          required: false,
        },
      ],
    });

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found",
      });
    }

    if (!donation.pan_number) {
      return res.status(400).json({
        success: false,
        message: "PAN number is required for tax certificate",
      });
    }

    // TODO: Generate PDF tax certificate using jsPDF
    res.status(200).json({
      success: true,
      message: "Tax certificate generation - to be implemented",
      data: donation,
    });
  } catch (error) {
    next(error);
  }
};
