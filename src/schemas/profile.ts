import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  location: z.string().optional(),
  cropsGrown: z.array(z.string()).optional(),
  farmingTechniques: z.array(z.string()).optional(),
  bio: z.string().max(500).optional(),
  profilePicture: z.string().url().optional(),
});