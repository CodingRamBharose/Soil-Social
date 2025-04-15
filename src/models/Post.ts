import mongoose, { Schema, Document, Types } from "mongoose";

export interface Post extends Document {
  content: string;
  images?: string[];
  videos?: string[];
  author: Types.ObjectId;
  likes: Types.ObjectId[];
  comments: Types.ObjectId[];
  shares: number;
  cropType?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const postSchema: Schema<Post> = new Schema({
  content: { type: String, required: true, maxlength: 2000 },
  images: { type: [String], default: [] },
  videos: { type: [String], default: [] },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  shares: { type: Number, default: 0 },
  cropType: { type: String },
  tags: { type: [String], default: [] }
}, { timestamps: true });

const PostModel = 
(mongoose.models.Post as mongoose.Model<Post>) ||
mongoose.model<Post>("Post", postSchema);

export default PostModel;