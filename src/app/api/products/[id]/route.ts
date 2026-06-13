import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const idOrSlug = id;
    const isObjectId = mongoose.Types.ObjectId.isValid(idOrSlug);
    const query = isObjectId ? { _id: idOrSlug } : { slug: idOrSlug };
    const product = await Product.findOne(query);

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    const doc = product.toObject();
    return NextResponse.json({ ...doc, id: doc._id.toString() });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized — Admin only" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    
    // Ensure slug is clean
    if (body.name && !body.slug) {
      body.slug = body.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    }

    const { id } = await params;
    const product = await Product.findByIdAndUpdate(id, body, { new: true, runValidators: true });

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    const doc = product.toObject();
    return NextResponse.json({ ...doc, id: doc._id.toString() });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Failed to update product" }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized — Admin only" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Failed to delete product" }, { status: 500 });
  }
}
