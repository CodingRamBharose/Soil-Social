import { NextResponse } from "next/server";
import connectDB from "@/config/dbConnect";
import PostModel from "@/models/Post";
import mongoose from "mongoose";

// GET: Fetch posts by user ID
export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  await connectDB();

  try {
    const { userId } = await params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "Invalid user ID format" },
        { status: 400 }
      );
    }

    const posts = await PostModel.find({ author: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: 'author',
        select: 'name profilePicture cropsGrown farmingTechniques location'
      })
      .lean();

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
