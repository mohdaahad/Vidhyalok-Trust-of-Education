import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { sendVolunteerConfirmation, sendVolunteerStatusUpdate } from "../services/email.service.js";

const Volunteer = sequelize.define(
  "Volunteer",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
  },
  first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Please provide first name",
        },
      },
  },
  last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Please provide last name",
        },
      },
  },
  email: {
      type: DataTypes.STRING,
      allowNull: false,
    unique: true,
      validate: {
        isEmail: {
          msg: "Please provide email",
        },
      },
      set(value) {
        this.setDataValue("email", value?.toLowerCase());
      },
  },
  phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Please provide phone number",
        },
      },
  },
  address: {
      type: DataTypes.STRING,
      allowNull: true,
  },
  city: {
      type: DataTypes.STRING,
      allowNull: false,
  },
  country: {
      type: DataTypes.STRING,
      allowNull: false,
  },
    skills: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    interests: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      validate: {
        isValidInterests(value) {
          const validInterests = [
            "Education",
            "Healthcare",
            "Environment",
            "Community Development",
            "Event Support",
            "Remote Work",
          ];
          if (value && Array.isArray(value)) {
            const invalid = value.filter((v) => !validInterests.includes(v));
            if (invalid.length > 0) {
              throw new Error(`Invalid interests: ${invalid.join(", ")}`);
            }
          }
        },
      },
    },
  availability: {
      type: DataTypes.ENUM("weekdays", "weekends", "flexible", "remote"),
      allowNull: false,
  },
  experience: {
      type: DataTypes.TEXT,
      allowNull: true,
  },
  motivation: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Please provide motivation",
        },
      },
  },
  status: {
      type: DataTypes.ENUM("pending", "active", "inactive", "rejected"),
      defaultValue: "pending",
  },
  hours_completed: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
  },
  projects_joined: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
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
    tableName: "volunteers",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    hooks: {
      afterCreate: async (volunteer) => {
        try {
          // Send confirmation email when volunteer is created
          await sendVolunteerConfirmation(volunteer);
          console.log(`✅ Volunteer confirmation email sent to ${volunteer.email}`);
        } catch (error) {
          console.error("❌ Error sending volunteer confirmation email:", error);
          // Don't throw error to prevent blocking volunteer creation
        }
      },
      afterUpdate: async (volunteer) => {
        try {
          // Send status update email if status changed
          if (volunteer.changed && volunteer.changed("status")) {
            const oldStatus = volunteer.previous ? volunteer.previous("status") : null;
            await sendVolunteerStatusUpdate(volunteer, oldStatus);
            console.log(`✅ Volunteer status update email sent to ${volunteer.email}`);
          }
        } catch (error) {
          console.error("❌ Error sending volunteer status update email:", error);
          // Don't throw error to prevent blocking status update
        }
      },
    },
  }
);

export default Volunteer;
