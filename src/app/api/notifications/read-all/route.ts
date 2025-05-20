// import { NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { options as authOptions } from '../../auth/[...nextauth]/options';
// import { NotificationModel } from '@/models/Notification';
// import connectDB from '@/config/dbConnect';

// export async function PUT() {
//   await connectDB();
//   const session = await getServerSession(authOptions);
  
//   if (!session) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   try {
//     await NotificationModel.updateMany(
//       { user: session.user.id, read: false },
//       { read: true }
//     );

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Failed to update notifications' },
//       { status: 500 }
//     );
//   }
// }