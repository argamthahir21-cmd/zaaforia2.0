import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized — Please login" }, { status: 401 });
    }

    await dbConnect();

    // Admins see all orders; users see their own orders
    const query = session.user.role === "admin" ? {} : { user: session.user.id };
    
    const orders = await Order.find(query).sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Failed to fetch orders" }, { status: 500 });
  }
}
