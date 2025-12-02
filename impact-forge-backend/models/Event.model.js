import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import NewsletterSubscription from "./NewsletterSubscription.model.js";
import { sendEventAnnouncement } from "../services/email.service.js";

const Event = sequelize.define(
  "Event",
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
          msg: "Please provide event title",
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Please provide event description",
        },
      },
    },
    full_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    time: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category: {
      type: DataTypes.ENUM(
        "Fundraiser",
        "Community",
        "Education",
        "Conference",
        "Workshop",
        "Other"
      ),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(
        "fundraiser",
        "volunteer",
        "community",
        "conference"
      ),
      defaultValue: "community",
    },
    max_participants: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    registered_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    capacity: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    attendees: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM("upcoming", "ongoing", "completed", "cancelled"),
      defaultValue: "upcoming",
    },
    impact: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_past: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    tableName: "events",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    hooks: {
      afterCreate: async (event) => {
        try {
          // Only send if event is upcoming
          if (event.status === "upcoming") {
            // Get all active newsletter subscribers
            const subscribers = await NewsletterSubscription.findAll({
              where: { status: "active" },
              attributes: ["email"],
            });

            if (subscribers.length > 0) {
              // Send announcement email to all subscribers
              await sendEventAnnouncement(event, subscribers);
              console.log(
                `✅ Event announcement sent to ${subscribers.length} subscribers`
              );
            }
          }
        } catch (error) {
          console.error("❌ Error sending event announcement emails:", error);
          // Don't throw error to prevent blocking event creation
        }
      },
    },
  }
);

export default Event;
