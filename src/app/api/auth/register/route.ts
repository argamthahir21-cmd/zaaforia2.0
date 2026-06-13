import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Name, email, and password are required" }, { status: 400 });
    }

    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Email is already registered" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
      savedAddresses: [],
      watchHistory: [],
    });

    return NextResponse.json(
      { message: "User registered successfully", user: { id: newUser._id, name: newUser.name, email: newUser.email } },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in registration:", error);
    return NextResponse.json({ message: error.message || "Failed to register user" }, { status: 500 });
  }
}
