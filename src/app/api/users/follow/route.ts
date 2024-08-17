import { NextRequest, NextResponse } from 'next/server';
import instance from '@/models/user';

export async function POST(req: NextRequest) {
    const { followerEmail, followingEmail } = await req.json();

    if (!followerEmail || !followingEmail) {
        return new NextResponse(
            JSON.stringify({ error: 'Missing required fields' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const session = instance.session();

    try {
        // Retrieve follower and following users by their email addresses
        const followerUser = await instance.first('User', 'email', followerEmail);
        const followingUser = await instance.first('User', 'email', followingEmail);

        if (!followerUser || !followingUser) {
            return new NextResponse(
                JSON.stringify({ error: 'User not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Extract usernames
        const followerUsername = followerUser.get('username');
        const followingUsername = followingUser.get('username');

        // Use usernames to send the follow request
        await followerUser.relateTo(followingUser, 'following');

        return new NextResponse(
            JSON.stringify({ message: `Successfully followed user: ${followingUsername}` }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error: any) {
        console.error('Error following user:', error.message);
        return new NextResponse(
            JSON.stringify({ error: 'Server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    } finally {
        await session.close();
    }
}

export async function DELETE(req: NextRequest) {
    const { followerEmail, followingEmail } = await req.json();

    if (!followerEmail || !followingEmail) {
        return new NextResponse(
            JSON.stringify({ error: 'Missing required fields' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const session = instance.session();

    try {
        // Retrieve follower and following users by their email addresses
        const followerUser = await instance.first('User', 'email', followerEmail);
        const followingUser = await instance.first('User', 'email', followingEmail);

        if (!followerUser || !followingUser) {
            return new NextResponse(
                JSON.stringify({ error: 'User not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Extract usernames
        const followerUsername = followerUser.get('username');
        const followingUsername = followingUser.get('username');

        // Use usernames to send the unfollow request
        await followerUser.detachFrom(followingUser);

        return new NextResponse(
            JSON.stringify({ message: `Successfully unfollowed user: ${followingUsername}` }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error: any) {
        console.error('Error unfollowing user:', error.message);
        return new NextResponse(
            JSON.stringify({ error: 'Server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    } finally {
        await session.close();
    }
}
