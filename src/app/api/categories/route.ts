import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Category } from "@/models/Category";
import { auth } from "@/auth";

export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find().sort({ createdAt: -1 });
    // Map _id to id
    const mapped = categories.map((c) => {
      const obj: any = c.toObject();
      obj.id = obj._id.toString();
      delete obj._id;
      return obj;
    });
    return NextResponse.json(mapped);
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    
    // Auto-generate slug if not provided
    if (!body.slug && body.name) {
      body.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const category = await Category.create(body);
    const obj: any = category.toObject();
    obj.id = obj._id.toString();
    delete obj._id;

    return NextResponse.json(obj, { status: 201 });
  } catch (error: any) {
    console.error("Error creating category:", error);
    if (error.code === 11000) {
      return NextResponse.json({ message: "Category slug must be unique" }, { status: 400 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
