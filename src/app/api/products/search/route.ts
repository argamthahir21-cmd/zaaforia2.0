import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const query = url.searchParams.get("q") || "";
    const page = parseInt(url.searchParams.get("page") || "0", 10);
    const size = 20;

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ content: [], totalElements: 0, totalPages: 0, page, size });
    }

    const regex = new RegExp(query.trim(), "i");
    const searchQuery = {
      $or: [
        { name: { $regex: regex } },
        { description: { $regex: regex } },
        { tags: { $in: [regex] } },
        { category: { $regex: regex } },
      ],
    };

    const skip = page * size;
    const items = await Product.find(searchQuery)
      .skip(skip)
      .limit(size);

    const total = await Product.countDocuments(searchQuery);

    const content = items.map((item) => {
      const doc = item.toObject();
      return {
        ...doc,
        id: doc._id.toString(),
      };
    });

    return NextResponse.json({
      content,
      totalElements: total,
      totalPages: Math.ceil(total / size),
      page,
      size,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Failed to search products" }, { status: 500 });
  }
}
