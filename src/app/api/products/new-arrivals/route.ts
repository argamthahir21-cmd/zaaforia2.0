import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();
    // Fetch products flagged as new arrivals, sorted by latest
    const items = await Product.find({ isNew: true }).sort({ createdAt: -1 }).limit(10);
    const content = items.map((item) => {
      const doc = item.toObject();
      return {
        ...doc,
        id: doc._id.toString(),
      };
    });
    return NextResponse.json(content);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Failed to fetch new arrivals" }, { status: 500 });
  }
}
