import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

const PRIMARY_ADMIN_EMAIL = "argamthahir21@gmail.com";
const PRIMARY_ADMIN_PASSWORD = "argam21";
const PRIMARY_ADMIN_NAME = "Argam Thahir";

/**
 * Seeds the primary admin account into MongoDB if it doesn't exist.
 * This runs automatically on first DB connection — idempotent.
 */
export async function seedPrimaryAdmin() {
  try {
    const existing = await User.findOne({ email: PRIMARY_ADMIN_EMAIL });

    if (existing) {
      // Ensure admin flags are set even if user already exists
      if (existing.role !== "admin" || existing.adminRole !== "primary") {
        existing.role = "admin";
        existing.adminRole = "primary";
        await existing.save();
        console.log("[Seed] ✓ Updated existing user to primary admin:", PRIMARY_ADMIN_EMAIL);
      }
      return;
    }

    const hashedPassword = await bcrypt.hash(PRIMARY_ADMIN_PASSWORD, 12);

    await User.create({
      name: PRIMARY_ADMIN_NAME,
      email: PRIMARY_ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin",
      adminRole: "primary",
    });

    console.log("[Seed] ✓ Primary admin account created:", PRIMARY_ADMIN_EMAIL);
  } catch (error: any) {
    // Duplicate key is fine — means it already exists
    if (error.code === 11000) {
      console.log("[Seed] Primary admin already exists, skipping.");
      return;
    }
    console.error("[Seed] ✗ Failed to seed primary admin:", error.message);
  }
}
