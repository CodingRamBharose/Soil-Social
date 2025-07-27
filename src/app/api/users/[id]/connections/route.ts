import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options as authOptions } from "@/app/api/auth/[...nextauth]/options";
import connectDB from "@/config/dbConnect";
import UserModel, { User } from "@/models/User";
import { Types } from "mongoose";
import { createNotification } from "@/lib/notifications";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Convert string ID to ObjectId
    let targetUserId: Types.ObjectId;
    try {
      targetUserId = new Types.ObjectId(id);
    } catch {
      return NextResponse.json(
        { error: "Invalid user ID format" },
        { status: 400 }
      );
    }

    const [currentUser, targetUser] = await Promise.all([
      UserModel.findOne({ email: session.user.email }),
      UserModel.findById(targetUserId)
    ]) as [User | null, User | null];

    if (!currentUser || !targetUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Compare ObjectIds directly
    if (currentUser._id.equals(targetUser._id)) {
      return NextResponse.json(
        { error: "Cannot connect with yourself" },
        { status: 400 }
      );
    }

    // Check if already connected
    if (currentUser.connections?.some(connId => connId.equals(targetUser._id))) {
      return NextResponse.json(
        { error: "Already connected with this user" },
        { status: 400 }
      );
    }

    // Check if request already sent
    if (currentUser.connectionRequests?.sent?.some(reqId => reqId.equals(targetUser._id))) {
      return NextResponse.json(
        { error: "Request already sent to this user" },
        { status: 400 }
      );
    }

    // Update both users' connection requests
    await Promise.all([
      UserModel.findByIdAndUpdate(
        currentUser._id,
        { $addToSet: { "connectionRequests.sent": targetUser._id } },
        { new: true }
      ),
      UserModel.findByIdAndUpdate(
        targetUser._id,
        { $addToSet: { "connectionRequests.received": currentUser._id } },
        { new: true }
      )
    ]);

    // Create notification for the target user
    await createNotification({
      userId: targetUser._id.toString(),
      senderId: currentUser._id.toString(),
      type: 'connection',
      content: `${currentUser.name} sent you a connection request`
    });

    return NextResponse.json({
      success: true,
      message: "Connection request sent successfully"
    });

  } catch (error) {
    console.error("Connection error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}