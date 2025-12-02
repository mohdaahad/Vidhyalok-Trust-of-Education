import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import {
  sendContactConfirmation,
  sendContactStatusUpdate,
} from "../services/email.service.js";

const ContactSubmission = sequelize.define(
  "ContactSubmission",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          msg: "Please provide a valid email",
        },
      },
      set(value) {
        this.setDataValue("email", value?.toLowerCase());
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("new", "read", "replied", "archived"),
      defaultValue: "new",
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
    tableName: "contact_submissions",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    hooks: {
      afterCreate: async (submission) => {
        try {
          // Send confirmation email when submission is created
          await sendContactConfirmation(submission);
          console.log(
            `✅ Contact confirmation email sent to ${submission.email}`
          );
        } catch (error) {
          console.error("❌ Error sending contact confirmation email:", error);
          // Don't throw error to prevent blocking submission creation
        }
      },
      afterUpdate: async (submission) => {
        try {
          // Send status update email if status changed
          if (submission.changed && submission.changed("status")) {
            const oldStatus = submission.previous
              ? submission.previous("status")
              : null;
            await sendContactStatusUpdate(submission, oldStatus);
            console.log(
              `✅ Contact status update email sent to ${submission.email}`
            );
          }
        } catch (error) {
          console.error("❌ Error sending contact status update email:", error);
          // Don't throw error to prevent blocking status update
        }
      },
    },
  }
);

export default ContactSubmission;
