// import { NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { options as authOptions } from '../auth/[...nextauth]/options';
// import { NotificationModel } from '@/models/Notification';
// import connectDB from '@/config/dbConnect';

// export async function GET() {
//   await connectDB();
//   const session = await getServerSession(authOptions);
  
//   if (!session) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   try {
//     const notifications = await NotificationModel
//       .find({ user: session.user.id })
//       .sort({ createdAt: -1 })
//       .populate('sender', 'name profilePicture')
//       .lean();

//     const unreadCount = await NotificationModel.countDocuments({
//       user: session.user.id,
//       read: false
//     });

//     return NextResponse.json({ notifications, unreadCount });
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Failed to fetch notifications' },
//       { status: 500 }
//     );
//   }
// }