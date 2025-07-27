import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options as authOptions } from "@/app/api/auth/[...nextauth]/options";
import connectDB from "@/config/dbConnect";
import UserModel from "@/models/User";
import mongoose from "mongoose";
import { createNotification } from "@/lib/notifications";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid user ID format" },
        { status: 400 }
      );
    }

    await connectDB();

    const [currentUser, requesterUser] = await Promise.all([
      UserModel.findOne({ email: session.user.email }),
      UserModel.findById(id)
    ]);

    if (!currentUser || !requesterUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (!currentUser.connectionRequests.received.includes(requesterUser.id)) {
      return NextResponse.json(
        { error: "No connection request found from this user" },
        { status: 400 }
      );
    }

    await Promise.all([
      UserModel.findByIdAndUpdate(currentUser.id, {
        $addToSet: { connections: requesterUser.id },
        $pull: { "connectionRequests.received": requesterUser.id }
      }),
      UserModel.findByIdAndUpdate(requesterUser.id, {
        $addToSet: { connections: currentUser.id },
        $pull: { "connectionRequests.sent": currentUser.id }
      })
    ]);

    // Create notifications for both users
    await Promise.all([
      createNotification({
        userId: currentUser._id.toString(),
        senderId: requesterUser._id.toString(),
        type: 'connection',
        content: `You are now connected with ${requesterUser.name}`
      }),
      createNotification({
        userId: requesterUser._id.toString(),
        senderId: currentUser._id.toString(),
        type: 'connection',
        content: `${currentUser.name} accepted your connection request`
      })
    ]);

    return NextResponse.json({
      success: true,
      message: "Connection added successfully"
    });

  } catch (error) {
    console.error("Connection error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}