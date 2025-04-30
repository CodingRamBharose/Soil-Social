import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options as authOptions } from "@/app/api/auth/[...nextauth]/options";
import connectDB from "@/config/dbConnect";
import UserModel from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await UserModel.findOne({ email: session.user.email })
      .populate({
        path: "connectionRequests.received",
        select: "name profilePicture cropsGrown farmingTechniques location"
      });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user.connectionRequests.received || []);
  } catch (error) {
    console.error("Error fetching connection requests:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}