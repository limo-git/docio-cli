import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/models/userModel'; 
import { connect } from '@/dbConfig/dbConfig';

export async function GET(req: Request) {
    const userId = req.headers.get('user-id');

    if (!userId) {
        return NextResponse.json({ message: 'Missing user ID' }, { status: 400 });
    }

    try {
        await connect();

        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user.projects);
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error', error }, { status: 500 });
    }
}
