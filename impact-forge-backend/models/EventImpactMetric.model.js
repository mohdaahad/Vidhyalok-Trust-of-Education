import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const EventImpactMetric = sequelize.define(
  "EventImpactMetric",
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
    label: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    icon_type: {
      type: DataTypes.ENUM(
        "Award",
        "Users",
        "TrendingUp",
        "MapPin",
        "Heart",
        "DollarSign"
      ),
      allowNull: true,
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
    tableName: "event_impact_metrics",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

export default EventImpactMetric;
