import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/config/dbConnect";
import PostModel from "@/models/Post";
import mongoose from "mongoose";

// GET: Fetch a specific post
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();

  try {
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Invalid post ID format" },
        { status: 400 }
      );
    }

    const post = await PostModel.findById(params.id)
      .populate({
        path: 'author',
        select: 'name profilePicture cropsGrown farmingTechniques location'
      })
      .lean();

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
