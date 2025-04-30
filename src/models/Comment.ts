import mongoose, { Schema, Document, Types } from "mongoose";

export interface Comment extends Document {
  content: string;
  author: Types.ObjectId;
  post: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema: Schema<Comment> = new Schema({
  content: { type: String, required: true, maxlength: 1000 },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true }
}, { timestamps: true });

const CommentModel = 
  (mongoose.models.Comment as mongoose.Model<Comment>) ||
  mongoose.model<Comment>("Comment", commentSchema);

export default CommentModel;
