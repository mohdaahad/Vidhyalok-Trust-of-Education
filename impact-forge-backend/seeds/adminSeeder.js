import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

/**
 * Admin Seeder
 * -----------
 * Run this file to create the default admin user.
 * Usage:  npm run seed
 */

const DB_CONFIG = {
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: parseInt(process.env.DB_PORT),
};

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const run = async () => {
  const sequelize = new Sequelize(
    DB_CONFIG.DB_NAME,
    DB_CONFIG.DB_USER,
    DB_CONFIG.DB_PASSWORD,
    {
      host: DB_CONFIG.DB_HOST,
      port: DB_CONFIG.DB_PORT,
      dialect: "mysql",
      logging: false,
    }
  );

  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    // Check if admin already exists
    const [results] = await sequelize.query(
      "SELECT id, email FROM users WHERE email = :email",
      { replacements: { email: ADMIN_EMAIL } }
    );

    if (results.length > 0) {
      console.log(
        `⚠️  Admin already exists: ${results[0].email} (ID: ${results[0].id})`
      );
      console.log("   Skipping creation. If you want to recreate, delete the existing admin first.");
    } else {
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

      // Insert admin user
      await sequelize.query(
        `INSERT INTO users (email, password_hash, role, created_at, updated_at)
         VALUES (:email, :password, 'admin', NOW(), NOW())`,
        {
          replacements: {
            email: ADMIN_EMAIL,
            password: hashedPassword,
          },
        }
      );

      console.log("👤 Default admin created successfully!");
      console.log(`   Email:    ${ADMIN_EMAIL}`);
      console.log(`   Password: ${ADMIN_PASSWORD}`);
    }
  } catch (error) {
    console.error("❌ Seeder error:", error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
    console.log("🔒 Database connection closed");
  }
};

run();
