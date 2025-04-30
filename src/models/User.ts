import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  emailVerified?: Date;
  image?: string;
  location?: string;
  cropsGrown?: string[];
  farmingTechniques?: string[];
  profilePicture?: string;
  bio?: string;
  connections?: Types.ObjectId[];
  connectionRequests?: {
    sent: Types.ObjectId[];
    received: Types.ObjectId[];
  };
  groups?: Types.ObjectId[];
  savedPosts?: Types.ObjectId[];
  eventsAttending?: Types.ObjectId[];
  resourcesShared?: Types.ObjectId[];
  listings?: Types.ObjectId[];
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Email is invalid"]
    },
    password: { type: String, required: true },
    verifyCode: { type: String, required: true },
    verifyCodeExpiry: { type: Date, required: true },
    isVerified: { type: Boolean, default: false },
    emailVerified: Date,
    image: String,
    location: String,
    cropsGrown: { type: [String], default: [] },
    farmingTechniques: { type: [String], default: [] },
    profilePicture: String,
    bio: { type: String, maxlength: 500 },
    connections: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    connectionRequests: {
      sent: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      received: [{ type: Schema.Types.ObjectId, ref: 'User' }]
    },
    groups: [{ type: Schema.Types.ObjectId, ref: 'Group' }],
    savedPosts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    eventsAttending: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
    resourcesShared: [{ type: Schema.Types.ObjectId, ref: 'Resource' }],
    listings: [{ type: Schema.Types.ObjectId, ref: 'MarketplaceListing' }]
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", userSchema);