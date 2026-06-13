import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

// Only primary admin can invite/remove
async function requirePrimaryAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return null;
  }
  await dbConnect();
  const user = await User.findOne({ email: session.user.email });
  if (!user || user.adminRole !== "primary") {
    return null;
  }
  return user;
}

/**
 * POST — Invite a secondary admin
 * Body: { email: string, password: string, name: string }
 */
export async function POST(req: Request) {
  try {
    const primaryAdmin = await requirePrimaryAdmin();
    if (!primaryAdmin) {
      return NextResponse.json({ message: "Unauthorized — Primary admin only" }, { status: 403 });
    }

    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ message: "Email, password, and name are required" }, { status: 400 });
    }

    // Check max 2 admins
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount >= 2) {
      return NextResponse.json({ message: "Maximum 2 admin accounts allowed. Remove the existing secondary admin first." }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });

    if (existingUser) {
      // Promote existing user to secondary admin
      existingUser.role = "admin";
      existingUser.adminRole = "secondary";
      existingUser.invitedBy = primaryAdmin.email;
      existingUser.password = await bcrypt.hash(password, 12);
      existingUser.name = name;
      await existingUser.save();

      return NextResponse.json({
        message: "User promoted to secondary admin",
        admin: { id: existingUser._id.toString(), name: existingUser.name, email: existingUser.email, adminRole: "secondary" },
      });
    }

    // Create new secondary admin
    const hashedPassword = await bcrypt.hash(password, 12);
    const newAdmin = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: "admin",
      adminRole: "secondary",
      invitedBy: primaryAdmin.email,
    });

    return NextResponse.json({
      message: "Secondary admin invited successfully",
      admin: { id: newAdmin._id.toString(), name: newAdmin.name, email: newAdmin.email, adminRole: "secondary" },
    }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ message: "A user with this email already exists" }, { status: 400 });
    }
    return NextResponse.json({ message: error.message || "Failed to invite admin" }, { status: 500 });
  }
}

/**
 * DELETE — Remove the secondary admin
 * Body: { email: string }
 */
export async function DELETE(req: Request) {
  try {
    const primaryAdmin = await requirePrimaryAdmin();
    if (!primaryAdmin) {
      return NextResponse.json({ message: "Unauthorized — Primary admin only" }, { status: 403 });
    }

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    // Cannot remove primary admin
    if (email.toLowerCase().trim() === primaryAdmin.email.toLowerCase()) {
      return NextResponse.json({ message: "Cannot remove the primary admin" }, { status: 400 });
    }

    const secondaryAdmin = await User.findOne({ email: email.toLowerCase().trim(), adminRole: "secondary" });
    if (!secondaryAdmin) {
      return NextResponse.json({ message: "Secondary admin not found" }, { status: 404 });
    }

    // Demote to regular user
    secondaryAdmin.role = "user";
    secondaryAdmin.adminRole = null;
    secondaryAdmin.invitedBy = undefined;
    await secondaryAdmin.save();

    return NextResponse.json({ message: "Secondary admin removed successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Failed to remove admin" }, { status: 500 });
  }
}
