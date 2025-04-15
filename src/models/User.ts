import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  location?: string;
  cropsGrown?: string[];
  farmingTechniques?: string[];
  profilePicture?: string;
  bio?: string;
  connections?: mongoose.Types.ObjectId[];
}

const userSchema: Schema<User> = new Schema(
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
    location: { type: String },
    cropsGrown: { type: [String], default: [] },
    farmingTechniques: { type: [String], default: [] },
    profilePicture: { type: String },
    bio: { type: String, maxlength: 500 },
    connections: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", userSchema);

export default UserModel;