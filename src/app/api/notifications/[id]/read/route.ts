import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { NotificationModel } from '@/models/Notification';
import { getServerSession } from 'next-auth';
import { options as authOptions } from '@/app/api/auth/[...nextauth]/options';
import connectDB from '@/config/dbConnect';
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await connectDB();
  const notification = await NotificationModel.findOneAndUpdate(
    { _id: params.id, user: session.user.id },
    { read: true },
    { new: true }
  );
  if (!notification) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
