// import { NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { options as authOptions } from '@/app/api/auth/[...nextauth]/options';
// import { NotificationModel } from '@/models/Notification';
// import connectDB from '@/config/dbConnect';

// export async function PUT(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   await connectDB();
//   const session = await getServerSession(authOptions);
  
//   if (!session) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   try {
//     const notification = await NotificationModel.findOneAndUpdate(
//       { _id: params.id, user: session.user.id },
//       { read: true },
//       { new: true }
//     );

//     if (!notification) {
//       return NextResponse.json(
//         { error: 'Notification not found' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Failed to update notification' },
//       { status: 500 }
//     );
//   }
// }