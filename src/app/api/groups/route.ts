import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import CropGroup from "@/models/CropGroup";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description, cropType } = await req.json();
    
    if (!name || !description || !cropType) {
      return NextResponse.json(
        { error: "Name, description, and crop type are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const cropGroup = await CropGroup.create({
      name,
      description,
      cropType,
      createdBy: session.user.id,
      members: [{
        user: session.user.id,
        role: 'admin',
        joinedAt: new Date()
      }]
    });

    return NextResponse.json(cropGroup, { status: 201 });
  } catch (error) {
    console.error("Error creating crop group:", error);
    return NextResponse.json(
      { error: "Failed to create crop group" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    // Get all groups
    const groups = await CropGroup.find()
      .populate('createdBy', 'name')
      .populate('members.user', 'name');

    // Get groups where the user is a member
    const joinedGroups = groups.filter(group => 
      group.members.some(member => member.user._id.toString() === session.user.id)
    );

    // Get groups where the user is not a member
    const availableGroups = groups.filter(group => 
      !group.members.some(member => member.user._id.toString() === session.user.id)
    );

    return NextResponse.json({
      groups: availableGroups,
      joinedGroups
    });
  } catch (error) {
    console.error("Error fetching groups:", error);
    return NextResponse.json(
      { error: "Failed to fetch groups" },
      { status: 500 }
    );
  }
} 