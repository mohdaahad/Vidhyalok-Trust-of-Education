import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import NewsletterSubscription from "./NewsletterSubscription.model.js";
import { sendProjectAnnouncement } from "../services/email.service.js";

const Project = sequelize.define(
  "Project",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Please provide project title",
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Please provide project description",
        },
      },
    },
    full_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    category: {
      type: DataTypes.ENUM(
        "education",
        "healthcare",
        "water",
        "shelter",
        "environment",
        "community"
      ),
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    target_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    raised_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    status: {
      type: DataTypes.ENUM("draft", "active", "completed", "cancelled"),
      defaultValue: "draft",
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    beneficiaries: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "projects",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    hooks: {
      afterCreate: async (project) => {
        try {
          // Only send if project is active
          if (project.status === "active") {
            // Get all active newsletter subscribers
            const subscribers = await NewsletterSubscription.findAll({
              where: { status: "active" },
              attributes: ["email"],
            });

            if (subscribers.length > 0) {
              // Send announcement email to all subscribers
              await sendProjectAnnouncement(project, subscribers);
              console.log(
                `✅ Project announcement sent to ${subscribers.length} subscribers`
              );
            }
          }
        } catch (error) {
          console.error("❌ Error sending project announcement emails:", error);
          // Don't throw error to prevent blocking project creation
        }
      },
    },
  }
);

// Virtual for progress percentage (using getter)
Object.defineProperty(Project.prototype, "progress", {
  get: function () {
    const target = parseFloat(this.target_amount) || 0;
    const raised = parseFloat(this.raised_amount) || 0;
    if (target === 0) return 0;
    return Math.min((raised / target) * 100, 100);
  },
});

export default Project;
