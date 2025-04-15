
import { NextResponse } from "next/server";
import connectDB from "@/config/dbConnect";
import PostModel from "@/models/Post";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { CreatePostSchema } from "@/schemas/postSchema";
import { z } from "zod";

// === GET: Fetch posts ===
export async function GET() {
  await connectDB();

  try {
    const posts = await PostModel.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("author", "name profilePicture")
      .lean();

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// === POST: Create post ===
export async function POST(req: Request) {
  await connectDB();
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await UserModel.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const validatedData = CreatePostSchema.parse({
      ...body,
      author: user.id.toString(),
    });

    const post = await PostModel.create({
      ...validatedData,
      author: user._id,
      likes: [],
      comments: [],
      shares: 0,
      videos: validatedData.videos || [],
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Post creation error:", error);
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

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
