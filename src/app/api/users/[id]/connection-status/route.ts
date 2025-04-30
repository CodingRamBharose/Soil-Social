import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import UserModel from "@/models/User";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid user ID format" },
        { status: 400 }
      );
    }

    const [currentUser, targetUser] = await Promise.all([
      UserModel.findOne({ email: session.user.email }),
      UserModel.findById(id)
    ]);

    if (!currentUser || !targetUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const isConnected = currentUser.connections.includes(targetUser._id);

    return NextResponse.json({
      isConnected,
      isCurrentUser: currentUser._id.toString() === targetUser._id.toString()
    });
  } catch (error) {
    console.error("Error checking connection status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
 