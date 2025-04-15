import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    isVerified: boolean;
    name: string;
    email: string;
    profilePicture?: string; 
    location?: string;
    bio?: string;
    cropsGrown?: string[];
    farmingTechniques?: string[];
  }

  interface Session extends DefaultSession {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    isVerified: boolean;
    name: string;
    email: string;
    profilePicture?: string;
    location?: string;
    bio?: string;
    cropsGrown?: string[];
    farmingTechniques?: string[];
  }
}