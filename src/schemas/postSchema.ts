import { Types } from "mongoose";
import { z } from "zod";

const objectIdSchema = z.string().refine((val) => {
  return Types.ObjectId.isValid(val);
}, "Invalid ObjectId");


export const PostSchema = z.object({
  content: z.string().min(1).max(2000),
  images: z.array(z.string().url()).optional(),
  videos: z.array(z.string().url()).optional(),
  author: objectIdSchema,
  likes: z.array(objectIdSchema).optional(),
  comments: z.array(objectIdSchema).optional(),
  shares: z.number().min(0).optional(),
  cropType: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const CreatePostSchema = PostSchema.pick({
  content: true,
  images: true,
  videos: true,
  cropType: true,
  tags: true
}).extend({
  author: PostSchema.shape.author // Explicitly include required author field
});


export type TPost = z.infer<typeof PostSchema>;
export type TCreatePost = z.infer<typeof CreatePostSchema>;



