import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/models/userModel'; 
import { connect } from '@/dbConfig/dbConfig';

export async function GET(req: Request) {
  const email = req.headers.get('user-email');

  if (!email) {
    return NextResponse.json({ message: 'Missing user email' }, { status: 400 });
  }

  try {
    await connect();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user.projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
