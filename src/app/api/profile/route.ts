import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { profileSchema } from "@/schemas/profile";
import UserModel from "@/models/User";
import { connectToDatabase } from "@/lib/db";
import { z } from "zod";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // console.log('Finding user with email:', session.user.email);
    const user = await UserModel.findOne({ email: session.user.email })
      .select('-password -__v')
      .populate('connections', 'name profilePicture cropsGrown location')
      .populate('connectionRequests.sent', 'name profilePicture cropsGrown')
      .populate('connectionRequests.received', 'name profilePicture cropsGrown')
      .lean();

    if (!user) {
      console.log('User not found');
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // console.log('User found:', user);
    return NextResponse.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    console.log('Connecting to database for PUT request...');
    await connectToDatabase();
    console.log('Database connected, getting session...');
    const session = await getServerSession(authOptions);
    // console.log('Session:', session);

    if (!session?.user?.email) {
      console.log('No session or email found');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    console.log('Request data:', data);
    const validatedData = profileSchema.parse(data);
    console.log('Validated data:', validatedData);

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
      console.log('User not found for update');
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // console.log('User updated:', user);
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
      { error: "Internal server error", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}