import mongoose, { Schema, Document, Types } from "mongoose";

export interface Notification extends Document {
  user: Types.ObjectId | string; 
  sender?: Types.ObjectId | string | {
    _id: Types.ObjectId | string;
    name: string;
    profilePicture?: string;
  };
  type: 'connection' | 'like' | 'comment' | 'message' | 'event' | 'marketplace';
  relatedId?: Types.ObjectId | string; 
  read: boolean;
  content: string;
  createdAt: string;
}

const notificationSchema: Schema<Notification> = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  sender: { type: Schema.Types.ObjectId, ref: "User" },
  type: { 
    type: String, 
    enum: ['connection', 'like', 'comment', 'message', 'event', 'marketplace'],
    required: true 
  },
  relatedId: { type: Schema.Types.ObjectId },
  read: { type: Boolean, default: false },
  content: { type: String, required: true }
}, { timestamps: true });

export const NotificationModel = mongoose.models.Notification || 
  mongoose.model<Notification>("Notification", notificationSchema);