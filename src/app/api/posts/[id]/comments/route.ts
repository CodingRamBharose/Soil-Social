import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/config/dbConnect";
import PostModel from "@/models/Post";
import UserModel from "@/models/User";
import CommentModel from "@/models/Comment";
import { NotificationModel } from "@/models/Notification";
import mongoose from "mongoose";
import { z } from "zod";

// Comment schema for validation
const CommentSchema = z.object({
  content: z.string().min(1).max(1000),
});

// GET: Fetch comments for a post
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

    const comments = await CommentModel.find({ post: params.id })
      .sort({ createdAt: -1 })
      .populate({
        path: 'author',
        select: 'name profilePicture'
      })
      .lean();

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Add a comment to a post
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Invalid post ID format" },
        { status: 400 }
      );
    }

    const [user, post] = await Promise.all([
      UserModel.findOne({ email: session.user.email }),
      PostModel.findById(params.id).populate('author', 'email')
    ]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const body = await req.json();
    
    try {
      const validatedData = CommentSchema.parse(body);
      
      // Create the comment
      const comment = await CommentModel.create({
        content: validatedData.content,
        author: user._id,
        post: post._id
      });

      // Add comment reference to the post
      await PostModel.findByIdAndUpdate(
        params.id,
        { $addToSet: { comments: comment._id } }
      );

      // Create notification if the post author is not the current user
      if (post.author._id.toString() !== user._id.toString()) {
        await NotificationModel.create({
          user: post.author._id,
          sender: user._id,
          type: 'comment',
          relatedId: post._id,
          content: `${user.name} commented on your post`
        });
      }

      // Return the comment with author details
      const populatedComment = await CommentModel.findById(comment._id)
        .populate({
          path: 'author',
          select: 'name profilePicture'
        })
        .lean();

      return NextResponse.json(populatedComment, { status: 201 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          {
            error: "Validation failed",
            details: error.errors.map((e) => ({
              path: e.path.join("."),
              message: e.message,
            })),
          },
          { status: 400 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error("Comment creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
