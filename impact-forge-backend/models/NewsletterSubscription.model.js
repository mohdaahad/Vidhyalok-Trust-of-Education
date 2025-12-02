import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { sendNewsletterWelcome } from "../services/email.service.js";

const NewsletterSubscription = sequelize.define(
  "NewsletterSubscription",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Please provide a valid email",
        },
      },
      set(value) {
        this.setDataValue("email", value?.toLowerCase());
      },
    },
    subscribed_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM("active", "unsubscribed", "bounced"),
      defaultValue: "active",
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "newsletter_subscriptions",
    timestamps: false,
    hooks: {
      beforeUpdate: (subscription) => {
        subscription.updated_at = new Date();
      },
      afterCreate: async (subscription) => {
        try {
          // Send welcome email when subscription is created
          if (subscription.status === "active") {
            await sendNewsletterWelcome(subscription.email);
            console.log(`✅ Welcome email sent to ${subscription.email}`);
          }
        } catch (error) {
          console.error("❌ Error sending welcome email:", error);
          // Don't throw error to prevent blocking subscription creation
        }
      },
    },
  }
);

export default NewsletterSubscription;
