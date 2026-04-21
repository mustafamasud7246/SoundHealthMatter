import { NextResponse } from "next/navigation";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password || password.length < 8) {
      return new Response(JSON.stringify({ message: "Invalid credentials. Password must be 8+ characters." }), { status: 400 });
    }

    await dbConnect();
    
    // Check if user exists
    const existingUser = await User.findOne({ email: { $eq: email } });
    if (existingUser) {
      return new Response(JSON.stringify({ message: "User already exists." }), { status: 400 });
    }

    // Secure Hash password (12 rounds)
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Save User
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    
    await newUser.save();

    return new Response(JSON.stringify({ message: "User registered successfully" }), { status: 201 });
  } catch (error: any) {
    console.error("Critical Registration Error:", error.message);
    return new Response(JSON.stringify({ message: "Internal Server Error. Please trace logs." }), { status: 500 });
  }
}
