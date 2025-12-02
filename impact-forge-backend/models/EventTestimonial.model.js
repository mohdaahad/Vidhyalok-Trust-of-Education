import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const EventTestimonial = sequelize.define(
  "EventTestimonial",
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(
        "Event Coordinator",
        "Volunteer",
        "Beneficiary",
        "Attendee"
      ),
      allowNull: true,
    },
    quote: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    display_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "event_testimonials",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

export default EventTestimonial;
