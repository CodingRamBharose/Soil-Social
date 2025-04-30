import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options as authOptions } from "@/app/api/auth/[...nextauth]/options";
import connectDB from "@/config/dbConnect";
import MessageModel from "@/models/Message";
import UserModel from "@/models/User";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get the other user's information
    const otherUser = await UserModel.findById(params.userId).select(
      "name profilePicture"
    );
    if (!otherUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get messages between the current user and the other user
    const messages = await MessageModel.find({
      $or: [
        {
          sender: new mongoose.Types.ObjectId(session.user.id),
          receiver: new mongoose.Types.ObjectId(params.userId),
        },
        {
          sender: new mongoose.Types.ObjectId(params.userId),
          receiver: new mongoose.Types.ObjectId(session.user.id),
        },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", "name profilePicture")
      .populate("receiver", "name profilePicture");

    // Mark messages as read
    await MessageModel.updateMany(
      {
        sender: new mongoose.Types.ObjectId(params.userId),
        receiver: new mongoose.Types.ObjectId(session.user.id),
        read: false,
      },
      { $set: { read: true } }
    );

    return NextResponse.json({
      messages,
      otherUser: {
        _id: otherUser._id,
        name: otherUser.name,
        profilePicture: otherUser.profilePicture,
      },
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { content } = await request.json();
    if (!content) {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    const message = await MessageModel.create({
      sender: new mongoose.Types.ObjectId(session.user.id),
      receiver: new mongoose.Types.ObjectId(params.userId),
      content,
      read: false,
    });

    const populatedMessage = await MessageModel.findById(message._id)
      .populate("sender", "name profilePicture")
      .populate("receiver", "name profilePicture");

    return NextResponse.json(populatedMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 