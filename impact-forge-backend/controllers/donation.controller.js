import Donation from "../models/Donation.model.js";
import Project from "../models/Project.model.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import { Op } from "sequelize";

// Initialize Razorpay only if credentials are available
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  try {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  } catch (error) {
    console.error("Failed to initialize Razorpay:", error);
  }
}

// @desc    Create donation
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
    } = req.body;

    // Generate unique transaction ID
    const transaction_id = `TXN${Date.now()}${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: transaction_id,
      notes: {
        email: donor_email,
        name: donor_name,
        donation_type: donation_type || "one-time",
        project_id: project_id || null,
      },
    };

    let order = null;
    if (!razorpay) {
      return res.status(500).json({
        success: false,
        message:
          "Payment gateway is not configured. Please contact administrator.",
      });
    }

    try {
      order = await razorpay.orders.create(options);
    } catch (razorpayError) {
      console.error("Razorpay error:", razorpayError);
      return res.status(500).json({
        success: false,
        message:
          razorpayError.error?.description ||
          "Failed to create payment order. Please check Razorpay credentials.",
        error: razorpayError.error || razorpayError.message,
      });
    }

    // Create donation record
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
      razorpay_order_id: order?.id || null,
      status: order ? "pending" : "pending",
      payment_method: "razorpay",
    });

    res.status(201).json({
      success: true,
      data: {
        donation,
        order: order || null,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify payment
// @route   POST /api/donations/verify-payment
// @access  Public
export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        success: false,
        message:
          "Payment gateway is not configured. Please contact administrator.",
      });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Update donation status
      const donation = await Donation.findOne({
        where: { razorpay_order_id },
      });

      if (!donation) {
        return res.status(404).json({
          success: false,
          message: "Donation not found",
        });
      }

      await donation.update({
        razorpay_payment_id,
        razorpay_signature,
        status: "completed",
      });

      // Update project raised amount if project specified
      if (donation.project_id) {
        const project = await Project.findByPk(donation.project_id);
        if (project) {
          await project.increment("amount_raised", {
            by: parseFloat(donation.amount),
          });
        }
      }

      // TODO: Send confirmation email

      res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        data: donation,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }
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

    res.status(200).json({
      success: true,
      count: donations.length,
      data: donations,
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

    await donation.update(req.body);

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

    // TODO: Generate PDF receipt using jsPDF
    res.status(200).json({
      success: true,
      message: "Receipt generation - to be implemented",
      data: donation,
    });
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
