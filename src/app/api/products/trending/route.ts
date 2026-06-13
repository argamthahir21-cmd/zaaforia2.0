import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();
    // Fetch products flagged as bestseller or featured as trending
    const items = await Product.find({ $or: [{ isBestseller: true }, { isFeatured: true }] }).limit(10);
    const content = items.map((item) => {
      const doc = item.toObject();
      return {
        ...doc,
        id: doc._id.toString(),
      };
    });
    return NextResponse.json(content);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Failed to fetch trending products" }, { status: 500 });
  }
}
