import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/neoDb';

export async function GET(req: NextRequest) {
  const driver = await connect(); // Connect to Neo4j AuraDB
  const session = driver.session(); // Create a session from the driver

  try {
    const email = req.nextUrl.searchParams.get('email');
    if (!email) {
      return NextResponse.json({ error: 'Missing email parameter' }, { status: 400 });
    }

    // Find the user by email and get their username
    const result = await session.run(
      `
      MATCH (u:User {email: $email})
      RETURN u.username AS username
      `,
      { email }
    );

    const username = result.records[0]?.get('username');

    if (!username) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ username }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching username:', error.message);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  } finally {
    await session.close(); // Ensure the session is closed
    await driver.close();  // Close the driver connection if you no longer need it
  }
}
