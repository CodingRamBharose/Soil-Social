import mongoose, { Schema, Document, Types } from "mongoose";

export interface Message extends Document {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  content: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema: Schema<Message> = new Schema(
  {
    sender: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    receiver: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    content: { 
      type: String, 
      required: true 
    },
    read: { 
      type: Boolean, 
      default: false 
    }
  },
  { timestamps: true }
);

// Index for faster querying of messages between two users
messageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });

const MessageModel =
  (mongoose.models.Message as mongoose.Model<Message>) ||
  mongoose.model<Message>("Message", messageSchema);

export default MessageModel; 