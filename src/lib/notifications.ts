import { NotificationModel } from '@/models/Notification';
import connectDB from '@/config/dbConnect';
import { Types } from 'mongoose';

interface CreateNotificationParams {
  userId: string | Types.ObjectId;
  senderId?: string | Types.ObjectId;
  type: 'connection' | 'like' | 'comment' | 'message' | 'event' | 'marketplace';
  relatedId?: string | Types.ObjectId;
  content: string;
}

export async function createNotification({
  userId,
  senderId,
  type,
  relatedId,
  content
}: CreateNotificationParams) {
  await connectDB();

  // Convert string IDs to ObjectId if needed
  const userObjectId = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;
  const senderObjectId = senderId ? (typeof senderId === 'string' ? new Types.ObjectId(senderId) : senderId) : undefined;
  const relatedObjectId = relatedId ? (typeof relatedId === 'string' ? new Types.ObjectId(relatedId) : relatedId) : undefined;

  const notification = new NotificationModel({
    user: userObjectId,
    sender: senderObjectId,
    type,
    relatedId: relatedObjectId,
    content,
    read: false
  });

  await notification.save();
  
  return await NotificationModel.findById(notification._id)
    .populate('sender', 'name profilePicture')
    .lean();
}

export async function getUserUnreadCount(userId: string | Types.ObjectId) {
  await connectDB();
  const userObjectId = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;
  return await NotificationModel.countDocuments({
    user: userObjectId,
    read: false
  });
}