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

    const currentUser = await UserModel.findOne({ email: session.user.email })
      .select('connections location cropsGrown farmingTechniques');
    
    if (!currentUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const query: any = { 
      _id: { $ne: currentUser._id },
      connections: { $nin: [currentUser._id] },
      $and: [
        { "connectionRequests.sent": { $nin: [currentUser._id] }},
        { "connectionRequests.received": { $nin: [currentUser._id] }}
      ]
    };

    if (currentUser.location) query.location = currentUser.location;
    if (currentUser.cropsGrown?.length) {
      query.cropsGrown = { $in: currentUser.cropsGrown };
    }

    const suggestions = await UserModel.find(query)
      .limit(10)
      .select('name profilePicture cropsGrown location')
      .lean();

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}