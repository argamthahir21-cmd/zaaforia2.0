import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Keep history at a reasonable limit (e.g. 20 items) and prevent duplicates
    const stringHistory = (user.watchHistory || []).map((id: any) => id.toString());
    const filteredHistory = stringHistory.filter((id: string) => id !== productId);
    
    // Add to the front of the array
    filteredHistory.unshift(productId);
    
    // Limit to 20
    const limitedHistory = filteredHistory.slice(0, 20);
    
    user.watchHistory = limitedHistory;
    await user.save();

    return NextResponse.json({ message: "History updated" });
  } catch (error: any) {
    console.error("Error updating history:", error);
    return NextResponse.json({ message: error.message || "Failed to update history" }, { status: 500 });
  }
}
