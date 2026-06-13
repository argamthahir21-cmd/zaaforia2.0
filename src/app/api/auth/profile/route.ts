import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { auth } from "@/auth";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email }).select("-password").populate("watchHistory");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ message: error.message || "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    await dbConnect();

    const allowedUpdates: any = {};
    if (body.name !== undefined) allowedUpdates.name = body.name;
    if (body.savedAddresses !== undefined) allowedUpdates.savedAddresses = body.savedAddresses;

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: allowedUpdates, $setOnInsert: { name: session.user.name || "User", role: "user" } },
      { new: true, upsert: true }
    ).select("-password").populate("watchHistory");

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ message: error.message || "Failed to update profile" }, { status: 500 });
  }
}
