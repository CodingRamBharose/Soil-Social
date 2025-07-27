import mongoose, { Schema, Document, Types } from 'mongoose';

export interface NotificationDoc extends Document {
  user: Types.ObjectId;
  sender?: Types.ObjectId | {
    _id: Types.ObjectId;
    name: string;
    profilePicture?: string;
  };
  type: 'connection' | 'like' | 'comment' | 'message' | 'event' | 'marketplace';
  relatedId?: Types.ObjectId;
  read: boolean;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<NotificationDoc>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    type: {
      type: String,
      enum: ['connection','like','comment','message','event','marketplace'],
      required: true,
    },
    relatedId: { type: Schema.Types.ObjectId },
    read: { type: Boolean, default: false },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export const NotificationModel = mongoose.models.Notification ||
  mongoose.model<NotificationDoc>('Notification', notificationSchema);
