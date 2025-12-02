import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { sendDonationConfirmation, sendDonationStatusUpdate } from "../services/email.service.js";

const Donation = sequelize.define(
  "Donation",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  transaction_id: {
      type: DataTypes.STRING,
    unique: true,
      allowNull: false,
  },
  donor_name: {
      type: DataTypes.STRING,
      allowNull: false,
  },
  donor_email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
      set(value) {
        this.setDataValue("donor_email", value?.toLowerCase());
      },
  },
  donor_phone: {
      type: DataTypes.STRING,
      allowNull: true,
  },
  amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: {
          args: [1],
          msg: "Donation amount must be at least 1",
        },
      },
  },
  project_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "projects",
        key: "id",
      },
  },
  payment_method: {
      type: DataTypes.ENUM("razorpay", "bank-transfer", "cash", "other"),
      defaultValue: "razorpay",
  },
  donation_type: {
      type: DataTypes.ENUM("one-time", "monthly"),
      defaultValue: "one-time",
  },
  status: {
      type: DataTypes.ENUM("pending", "completed", "failed", "refunded"),
      defaultValue: "pending",
  },
  is_anonymous: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
  },
  message: {
      type: DataTypes.TEXT,
      allowNull: true,
  },
  pan_number: {
      type: DataTypes.STRING(10),
      allowNull: true,
      set(value) {
        this.setDataValue("pan_number", value?.toUpperCase());
      },
  },
    razorpay_order_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    razorpay_payment_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    razorpay_signature: {
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
    tableName: "donations",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    hooks: {
      afterCreate: async (donation) => {
        try {
          // Send confirmation email when donation is created
          await sendDonationConfirmation(donation);
          console.log(`✅ Donation confirmation email sent to ${donation.donor_email}`);
        } catch (error) {
          console.error("❌ Error sending donation confirmation email:", error);
          // Don't throw error to prevent blocking donation creation
        }
      },
      afterUpdate: async (donation) => {
        try {
          // Send status update email if status changed
          if (donation.changed && donation.changed("status")) {
            const oldStatus = donation.previous ? donation.previous("status") : null;
            await sendDonationStatusUpdate(donation, oldStatus);
            console.log(`✅ Donation status update email sent to ${donation.donor_email}`);
          }
        } catch (error) {
          console.error("❌ Error sending donation status update email:", error);
          // Don't throw error to prevent blocking status update
        }
      },
    },
  }
);

export default Donation;
