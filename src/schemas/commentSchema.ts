import { z } from "zod";

export const CommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(1000, "Comment is too long"),
});

export type TComment = z.infer<typeof CommentSchema>;
