import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import dbConnect from '@/config/dbConnect';
import bcrypt from 'bcryptjs';
import UserModel from '@/models/User';

export const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();

        const user = await UserModel.findOne({ email: credentials?.email });

        if (!user) {
          throw new Error('No user found with this email');
        }

        if (!user.isVerified) {
          throw new Error('Please verify your email first');
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error('Invalid password');
        }

        return {
          id: user._id?.toString(),
          name: user.name,
          email: user.email,
          isVerified: user.isVerified,
          profilePicture: user.profilePicture,
          location: user.location,
          bio: user.bio,
          cropsGrown: user.cropsGrown,
          farmingTechniques: user.farmingTechniques,
          
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isVerified = user.isVerified;
        token.name = user.name;
        token.email = user.email;
        token.profilePicture = user.profilePicture;
        token.location = user.location;
        token.bio = user.bio;
        token.cropsGrown = user.cropsGrown;
        token.farmingTechniques = user.farmingTechniques;
        token.connectionRequests = user.connectionRequests;
        token.connections = user.connections;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        isVerified: token.isVerified,
        name: token.name,
        email: token.email,
        profilePicture: token.profilePicture,
        location: token.location,
        bio: token.bio,
        cropsGrown: token.cropsGrown,
        farmingTechniques: token.farmingTechniques,
        connectionRequests: token.connectionRequests,
        connections: token.connections
      };
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "credentials") {
        return true;
      }
      
      if (account?.provider === "google") {
        await dbConnect();
        const existingUser = await UserModel.findOne({ email: user.email });
        
        if (existingUser) {
          user.id = existingUser.id.toString();
          user.isVerified = existingUser.isVerified;
          user.profilePicture = existingUser.profilePicture;
          user.location = existingUser.location;
          user.bio = existingUser.bio;
          user.cropsGrown = existingUser.cropsGrown;
          user.farmingTechniques = existingUser.farmingTechniques;
        }
        return true;
      }
      return false;
    }
  },

  pages: {
    signIn: '/sign-in',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};