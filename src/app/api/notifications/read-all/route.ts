import { NextResponse } from 'next/server';
import { NotificationModel } from '@/models/Notification';
import { getServerSession } from 'next-auth';
import { options as authOptions } from '@/app/api/auth/[...nextauth]/options';
import connectDB from '@/config/dbConnect';

export async function PUT() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await connectDB();
  await NotificationModel.updateMany({ user: session.user.id, read: false }, { read: true });
  return NextResponse.json({ success: true });
}
