import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextAuthOptions } from 'next-auth';
import bcrypt from "bcryptjs";
import { connect } from '@/dbConfig/dbConfig';
import userModel from '@/models/userModel';

// NextAuth configuration
export const authOptions: NextAuthOptions = {
  providers: [
    // Configure the credentials provider
    CredentialsProvider({
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any): Promise<any> {
        console.log("Authorize function called with credentials:", credentials);
        await connect();
        try {
          const user = await userModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier }
            ]
          });
          console.log("User found:", user);
          if (!user) {
            throw new Error("No user found");
          }
          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Incorrect password");
          }
        } catch (err: any) {
          console.log("Error in authorize function:", err.message);
          throw new Error(err.message);
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user , session}) {
      console.log("JWT callback called with token:", token, "and user:", user , "and session",session);
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },

    async session({ session, token , user }) {
      console.log("Session callback called with session:", session, "and token:", token , "and user" , user);
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET
}

export default NextAuth(authOptions);
