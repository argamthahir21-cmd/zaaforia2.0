import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const category = url.searchParams.get("category");
    const sort = url.searchParams.get("sort") || "createdAt:desc";
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const size = parseInt(url.searchParams.get("size") || "20", 10);
    const ids = url.searchParams.get("ids");

    const query: any = {};
    if (category && category !== "All" && category.toLowerCase() !== "all") {
      // Case insensitive match
      query.category = { $regex: new RegExp(`^${category}$`, "i") };
    }
    if (ids) {
      query._id = { $in: ids.split(",") };
    }

    const sortFields = sort.split(":");
    const sortKey = sortFields[0] === "price_asc" ? "price" : sortFields[0] === "price_desc" ? "price" : sortFields[0];
    const sortOrder = (sortFields[1] === "asc" || sortFields[0] === "price_asc") ? 1 : -1;
    const sortQuery: any = { [sortKey]: sortOrder };

    const skip = (page - 1) * size;
    const items = await Product.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(size);

    const total = await Product.countDocuments(query);

    // Transform Mongoose _id to virtual id for frontend compatibility
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
    return NextResponse.json({ message: error.message || "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized — Admin only" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    
    // Ensure slug is unique
    if (!body.slug && body.name) {
      body.slug = body.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    }

    const product = await Product.create(body);
    const doc = product.toObject();
    return NextResponse.json({ ...doc, id: doc._id.toString() }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Failed to create product" }, { status: 400 });
  }
}
