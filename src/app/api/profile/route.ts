import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { profileSchema } from "@/schemas/profile";
import UserModel from "@/models/User";
import connectDB from "@/config/dbConnect";
import { z } from "zod";

export async function GET() {
  await connectDB();
  const session = await getServerSession();
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await UserModel.findOne({ email: session.user.email })
      .select('-password -__v')
      .lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  await connectDB();
  const session = await getServerSession();
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const validatedData = profileSchema.parse(data);

    const user = await UserModel.findOneAndUpdate(
      { email: session.user.email },
      { $set: validatedData },
      { 
        new: true,
        runValidators: true,
        select: '-password -__v'
      }
    ).lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Profile update error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}