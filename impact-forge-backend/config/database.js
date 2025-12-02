import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

/**
 * Get DB Config from environment variables
 */
const getDBConfig = () => ({
  DB_NAME: process.env.DB_NAME || "impact_forge",
  DB_USER: process.env.DB_USER || "root",
  DB_PASSWORD: process.env.DB_PASSWORD || "",
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_PORT: parseInt(process.env.DB_PORT || "3306", 10),
});

let sequelizeInstance = null;

/**
 * Initialize or reuse Sequelize instance
 */
const getSequelize = () => {
  const config = getDBConfig();

  if (!sequelizeInstance) {
    sequelizeInstance = new Sequelize(
      config.DB_NAME,
      config.DB_USER,
      config.DB_PASSWORD,
      {
        host: config.DB_HOST,
        port: config.DB_PORT,
        dialect: "mysql",
        logging: false,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
      }
    );
  }

  return sequelizeInstance;
};

/**
 * Create default admin
 */
const createDefaultAdmin = async (db) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@vidhyaloktrust.org";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    // Import User model directly to ensure it's available
    const { default: User } = await import("../models/User.model.js");

    if (!User) {
      console.log("⚠️ User model not found. Skipping default admin creation.");
      return;
    }

    const existingAdmin = await User.findOne({ where: { email: adminEmail } });

    if (!existingAdmin) {
      const admin = await User.create({
        email: adminEmail,
        password_hash: adminPassword, // Will be hashed by beforeSave hook
        role: "admin",
      });

      console.log(`👤 Default admin created`);
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
      console.log(`   ID: ${admin.id}`);
    } else {
      console.log(
        `✅ Admin already exists: ${adminEmail} (ID: ${existingAdmin.id})`
      );
    }
  } catch (error) {
    console.error("⚠️ Error creating default admin:", error.message);
    console.error(error.stack);
  }
};

/**
 * Connect to MySQL Database
 */
const connectDB = async () => {
  try {
    const db = getSequelize();
    const config = getDBConfig();

    if (!config.DB_PASSWORD) {
      throw new Error("DB_PASSWORD is missing in environment variables.");
    }

    await db.authenticate();
    console.log("✅ Database connected successfully");

    // Import all models dynamically
    await import("../models/index.js");

    if (process.env.NODE_ENV === "development") {
      console.log("🔄 Syncing database...");
      await db.query("SET FOREIGN_KEY_CHECKS = 0");
      await db.sync({ alter: false });
      await db.query("SET FOREIGN_KEY_CHECKS = 1");

      console.log(`📊 Models synced: ${Object.keys(db.models).join(", ")}`);

      await createDefaultAdmin(db);
    }
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
    process.exit(1);
  }
};

export const sequelize = new Proxy(
  {},
  {
    get(_, prop) {
      const instance = getSequelize();
      return typeof instance[prop] === "function"
        ? instance[prop].bind(instance)
        : instance[prop];
    },
  }
);

export { connectDB };
