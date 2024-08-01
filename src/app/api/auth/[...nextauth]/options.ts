import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextAuthOptions } from 'next-auth';
import bcrypt from 'bcryptjs';
import { connect } from '@/dbConfig/dbConfig';
import userModel from '@/models/userModel';

// NextAuth configuration
export const authOptions: NextAuthOptions = {
  providers: [

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
              { email: credentials.email },
              { username: credentials.email }
              
              
            ]
          }).select('password _id email username projects');
          console.log("User found:", user);
          if (!user) {
            throw new Error("No user found");
          }
          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
          if (isPasswordCorrect) {
            const userObject = user.toObject();
            delete userObject.password;
            return userObject;
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
  
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET
};

export default NextAuth(authOptions);
