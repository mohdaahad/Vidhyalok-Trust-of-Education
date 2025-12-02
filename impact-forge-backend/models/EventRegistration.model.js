import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import Event from "./Event.model.js";
import { sendEventRegistrationConfirmation, sendEventRegistrationStatusUpdate } from "../services/email.service.js";

const EventRegistration = sequelize.define(
  "EventRegistration",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "events",
        key: "id",
      },
    },
    participant_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    participant_email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
      set(value) {
        this.setDataValue("participant_email", value?.toLowerCase());
      },
    },
    participant_phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    number_of_guests: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      validate: {
        min: 1,
      },
    },
    special_requirements: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "cancelled", "attended"),
      defaultValue: "pending",
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
    tableName: "event_registrations",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    hooks: {
      afterCreate: async (registration) => {
        try {
          // Send confirmation email when registration is created
          const event = await Event.findByPk(registration.event_id);
          if (event) {
            await sendEventRegistrationConfirmation(registration, event);
            console.log(`✅ Event registration confirmation sent to ${registration.participant_email}`);
          }
        } catch (error) {
          console.error("❌ Error sending event registration confirmation email:", error);
          // Don't throw error to prevent blocking registration creation
        }
      },
      afterUpdate: async (registration) => {
        try {
          // Send status update email if status changed
          if (registration.changed && registration.changed("status")) {
            const oldStatus = registration.previous ? registration.previous("status") : null;
            const event = await Event.findByPk(registration.event_id);
            if (event) {
              await sendEventRegistrationStatusUpdate(registration, event, oldStatus);
              console.log(`✅ Event registration status update sent to ${registration.participant_email}`);
            }
          }
        } catch (error) {
          console.error("❌ Error sending event registration status update email:", error);
          // Don't throw error to prevent blocking status update
        }
      },
    },
  }
);

export default EventRegistration;
