import mongoose, { Schema, Document, Types } from "mongoose";

export interface CropGroup extends Document {
  name: string;
  description: string;
  cropType: string;
  createdBy: Types.ObjectId | string;
  members: Array<{
    user: Types.ObjectId | string;
    role: 'admin' | 'member';
    joinedAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const cropGroupSchema = new Schema<CropGroup>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    cropType: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      role: {
        type: String,
        enum: ['admin', 'member'],
        default: 'member',
      },
      joinedAt: {
        type: Date,
        default: Date.now,
      },
    }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.CropGroup || mongoose.model<CropGroup>("CropGroup", cropGroupSchema); 