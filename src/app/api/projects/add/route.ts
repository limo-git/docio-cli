import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/userModel';
import {connect} from '@/dbConfig/dbConfig';
import { getServerSession } from 'next-auth';

export async function POST(req: NextRequest) {
  try {
    await connect();

    const { title, description, link, userId } = await req.json();

    if (!title || !description || !link || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const newProject = { title, description, link };
    user.projects.push(newProject);
    await user.save();

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
