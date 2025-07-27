// File: app/api/notifications/route.ts
import { NextResponse } from 'next/server';
import { NotificationModel } from '@/models/Notification';
import { getServerSession } from 'next-auth';
import { options as authOptions } from '@/app/api/auth/[...nextauth]/options';
import connectDB from '@/config/dbConnect';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  const notifications = await NotificationModel.find({ user: session.user.id })
    .sort({ createdAt: -1 })
    .populate('sender', 'name profilePicture')
    .lean();

  const unreadCount = await NotificationModel.countDocuments({ user: session.user.id, read: false });

  const sanitized = notifications.map((n: Record<string, unknown>) => {
    const sender = n.sender as { _id: string; name: string; profilePicture?: string } | undefined;
    const createdAt = n.createdAt as Date | string;

    return {
      _id: String(n._id),
      user: String(n.user),
      sender: sender
        ? {
            _id: String(sender._id),
            name: sender.name,
            profilePicture: sender.profilePicture ?? '',
          }
        : undefined,
      type: n.type as string,
      relatedId: n.relatedId ? String(n.relatedId) : undefined,
      read: n.read as boolean,
      content: n.content as string,
      createdAt: createdAt instanceof Date ? createdAt.toISOString() : String(createdAt),
    };
  });

  return NextResponse.json({ notifications: sanitized, unreadCount });
}
