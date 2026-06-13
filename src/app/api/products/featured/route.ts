import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();
    // Fetch products flagged as featured
    const items = await Product.find({ isFeatured: true }).limit(8);
    const content = items.map((item) => {
      const doc = item.toObject();
      return {
        ...doc,
        id: doc._id.toString(),
      };
    });
    return NextResponse.json(content);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Failed to fetch featured products" }, { status: 500 });
  }
}
