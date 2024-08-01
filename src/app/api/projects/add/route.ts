import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/userModel';
import { connect } from '@/dbConfig/dbConfig';

export async function POST(req: NextRequest) {
  try {
    await connect();

    const { title, description, link, email } = await req.json();

    if (!title || !description || !link || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const user = await User.findOne({ email });
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
