import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { Settings } from "@/models/Settings";
import { NextResponse } from "next/server";

// Only primary admin can access settings
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

export async function GET() {
  try {
    const primaryAdmin = await requirePrimaryAdmin();
    if (!primaryAdmin) {
      return NextResponse.json({ message: "Unauthorized — Primary admin only" }, { status: 403 });
    }

    // Get all admin users
    const admins = await User.find({ role: "admin" }).select("name email adminRole createdAt").lean();

    return NextResponse.json({
      admins: admins.map((a: any) => ({
        id: a._id.toString(),
        name: a.name,
        email: a.email,
        adminRole: a.adminRole,
        createdAt: a.createdAt,
      })),
      maxAdmins: 2,
      currentCount: admins.length,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const primaryAdmin = await requirePrimaryAdmin();
    if (!primaryAdmin) {
      return NextResponse.json({ message: "Unauthorized — Primary admin only" }, { status: 403 });
    }

    const { deliveryAmount, freeDeliveryThreshold } = await req.json();

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }

    settings.deliveryAmount = deliveryAmount;
    settings.freeDeliveryThreshold = freeDeliveryThreshold;
    await settings.save();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Failed to update settings" }, { status: 500 });
  }
}
