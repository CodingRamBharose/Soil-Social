import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/config/dbConnect";
import PostModel from "@/models/Post";
import UserModel from "@/models/User";
import { NotificationModel } from "@/models/Notification";
import mongoose from "mongoose";

// POST: Like or unlike a post
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid post ID format" },
        { status: 400 }
      );
    }

    const [user, post] = await Promise.all([
      UserModel.findOne({ email: session.user.email }),
      PostModel.findById(id).populate('author', 'email')
    ]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if user already liked the post
    const alreadyLiked = post.likes.some(likeId =>
      likeId.toString() === user._id.toString()
    );

    let updatedPost;

    if (alreadyLiked) {
      // Unlike the post
      updatedPost = await PostModel.findByIdAndUpdate(
        id,
        { $pull: { likes: user._id } },
        { new: true }
      );
    } else {
      // Like the post
      updatedPost = await PostModel.findByIdAndUpdate(
        id,
        { $addToSet: { likes: user._id } },
        { new: true }
      );

      // Create notification if the post author is not the current user
      if (post.author._id.toString() !== user._id.toString()) {
        await NotificationModel.create({
          user: post.author._id,
          sender: user._id,
          type: 'like',
          relatedId: post._id,
          content: `${user.name} liked your post`
        });
      }
    }

    return NextResponse.json({
      success: true,
      liked: !alreadyLiked,
      likesCount: updatedPost?.likes.length || 0
    });
  } catch (error) {
    console.error("Like/unlike error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
