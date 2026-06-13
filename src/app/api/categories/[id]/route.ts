import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Category } from "@/models/Category";
import { auth } from "@/auth";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const category = await Category.findById(id);
    if (!category) return NextResponse.json({ message: "Category not found" }, { status: 404 });
    const obj: any = category.toObject();
    obj.id = obj._id.toString();
    delete obj._id;
    return NextResponse.json(obj);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || !session.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    
    if (body.name && !body.slug) {
      body.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const { id } = await params;
    const category = await Category.findByIdAndUpdate(id, body, { new: true });
    if (!category) return NextResponse.json({ message: "Category not found" }, { status: 404 });
    
    const obj: any = category.toObject();
    obj.id = obj._id.toString();
    delete obj._id;

    return NextResponse.json(obj);
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ message: "Category slug must be unique" }, { status: 400 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || !session.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) return NextResponse.json({ message: "Category not found" }, { status: 404 });
    
    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
