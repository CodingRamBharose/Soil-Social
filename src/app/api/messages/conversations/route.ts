import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options as authOptions } from "@/app/api/auth/[...nextauth]/options";
import connectDB from "@/config/dbConnect";
import MessageModel from "@/models/Message";
import UserModel from "@/models/User";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get all unique users the current user has messaged with
    const conversations = await MessageModel.aggregate([
      {
        $match: {
          $or: [
            { sender: new mongoose.Types.ObjectId(session.user.id) },
            { receiver: new mongoose.Types.ObjectId(session.user.id) }
          ]
        }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$sender", new mongoose.Types.ObjectId(session.user.id)] },
              "$receiver",
              "$sender"
            ]
          },
          lastMessage: { $last: "$$ROOT" },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$receiver", new mongoose.Types.ObjectId(session.user.id)] },
                    { $eq: ["$read", false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "participant"
        }
      },
      {
        $unwind: "$participant"
      },
      {
        $project: {
          _id: 1,
          participants: [
            {
              _id: "$participant._id",
              name: "$participant.name",
              profilePicture: "$participant.profilePicture"
            }
          ],
          lastMessage: {
            content: "$lastMessage.content",
            sender: "$lastMessage.sender",
            createdAt: "$lastMessage.createdAt"
          },
          unreadCount: 1
        }
      },
      {
        $sort: { "lastMessage.createdAt": -1 }
      }
    ]);

    return NextResponse.json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 