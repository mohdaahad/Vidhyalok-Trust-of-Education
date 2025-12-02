import Donation from "../models/Donation.model.js";
import Volunteer from "../models/Volunteer.model.js";
import Project from "../models/Project.model.js";
import Event from "../models/Event.model.js";
import User from "../models/User.model.js";
import ContactSubmission from "../models/ContactSubmission.model.js";
import NewsletterSubscription from "../models/NewsletterSubscription.model.js";
import { Op } from "sequelize";
import { sequelize } from "../config/database.js";

// Import models/index to ensure relationships are loaded
import "../models/index.js";

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalDonationsResult,
      totalDonationsCount,
      totalVolunteers,
      activeVolunteers,
      activeProjects,
      totalProjects,
      upcomingEvents,
      totalEvents,
      newContacts,
      totalNewsletters,
    ] = await Promise.all([
      // Total donations amount (completed only)
      Donation.findAll({
        where: { status: "completed" },
        attributes: [[sequelize.fn("SUM", sequelize.col("amount")), "total"]],
        raw: true,
      }),
      // Total donations count
      Donation.count({ where: { status: "completed" } }),
      // Total volunteers
      Volunteer.count(),
      // Active volunteers
      Volunteer.count({ where: { status: "active" } }),
      // Active projects
      Project.count({ where: { status: "active" } }),
      // Total projects
      Project.count(),
      // Upcoming events
      Event.count({ where: { status: "upcoming" } }),
      // Total events
      Event.count(),
      // New contact submissions
      ContactSubmission.count({ where: { status: "new" } }),
      // Total newsletter subscriptions
      NewsletterSubscription.count({ where: { status: "active" } }),
    ]);

    const totalDonations = parseFloat(totalDonationsResult[0]?.total || 0);

    // Get monthly donations data for chart (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Use raw query to handle GROUP BY properly with MySQL's ONLY_FULL_GROUP_BY mode
    // Use ANY_VALUE() for month name since all rows in same group have same month
    const monthlyDonationsRaw = await sequelize.query(
      `SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as date_key,
        ANY_VALUE(DATE_FORMAT(created_at, '%b')) as month,
        SUM(amount) as amount
      FROM donations
      WHERE status = 'completed' AND created_at >= :sixMonthsAgo
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY date_key ASC`,
      {
        replacements: { sixMonthsAgo },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    // Get project distribution data
    const projectDistribution = await Project.findAll({
      attributes: [
        "category",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["category"],
      raw: true,
    });

    const stats = {
      totalDonations,
      totalDonationsCount,
      totalVolunteers,
      activeVolunteers,
      activeProjects,
      totalProjects,
      upcomingEvents,
      totalEvents,
      newContacts,
      totalNewsletters,
      monthlyDonations: monthlyDonationsRaw.map((item) => ({
        month: item.month,
        amount: parseFloat(item.amount || 0),
      })),
      projectDistribution: projectDistribution.map((item) => ({
        name: item.category,
        value: parseInt(item.count || 0),
      })),
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all donors
// @route   GET /api/admin/donors
// @access  Private/Admin
export const getDonors = async (req, res, next) => {
  try {
    // Get unique donors from donations
    const donors = await Donation.findAll({
      where: { status: "completed" },
      attributes: [
        "donor_email",
        "donor_name",
        [sequelize.fn("SUM", sequelize.col("amount")), "total_donated"],
        [sequelize.fn("COUNT", sequelize.col("id")), "donation_count"],
      ],
      group: ["donor_email", "donor_name"],
      order: [[sequelize.fn("SUM", sequelize.col("amount")), "DESC"]],
      raw: true,
    });

    res.status(200).json({
      success: true,
      count: donors.length,
      data: donors.map((donor) => ({
        email: donor.donor_email,
        name: donor.donor_name,
        totalDonated: parseFloat(donor.total_donated || 0),
        donationCount: parseInt(donor.donation_count || 0),
      })),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all transactions
// @route   GET /api/admin/transactions
// @access  Private/Admin
export const getTransactions = async (req, res, next) => {
  try {
    const transactions = await Donation.findAll({
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
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export reports
// @route   GET /api/admin/reports/export
// @access  Private/Admin
export const exportReports = async (req, res, next) => {
  try {
    const { type, format } = req.query;

    // TODO: Implement report export functionality
    // This would generate Excel/PDF reports based on type and format

    res.status(200).json({
      success: true,
      message: "Report export - to be implemented",
      type,
      format,
    });
  } catch (error) {
    next(error);
  }
};
