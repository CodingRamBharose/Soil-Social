// types/User.ts
export interface SafeUser {
  _id: string;
  name: string;
  email: string;
  isVerified: boolean;
  emailVerified?: string;
  image?: string;
  location?: string;
  cropsGrown?: string[];
  farmingTechniques?: string[];
  profilePicture?: string;
  bio?: string;
  connections?: string[]; // stringified ObjectIds
  connectionRequests?: {
    sent: string[];
    received: string[];
  };
  groups?: string[];
  savedPosts?: string[];
  eventsAttending?: string[];
  resourcesShared?: string[];
  listings?: string[];
  createdAt: string;
  updatedAt: string;
}
