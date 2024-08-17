// import { NextRequest, NextResponse } from 'next/server';
// import User from '@/models/userModel';
// import { connect } from '@/dbConfig/dbConfig';

// export async function POST(req: NextRequest) {
//   try {
//     await connect();

//     const { title, description, link, email } = await req.json();

//     if (!title || !description || !link || !email) {
//       return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
//     }

//     const user = await User.findOne({ email });
//     if (!user) {
//       return NextResponse.json({ error: 'User not found' }, { status: 404 });
//     }

//     const newProject = { title, description, link };
//     user.projects.push(newProject);
//     await user.save();

//     return NextResponse.json(newProject, { status: 201 });
//   } catch (error) {
//     console.error('Error creating project:', error);
//     return NextResponse.json({ error: 'Server error' }, { status: 500 });
//   }
// }


import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/neoDb';

export async function POST(req: NextRequest) {
  const driver = await connect(); // Connect to Neo4j AuraDB
  const session = driver.session(); // Create a session from the driver

  try {
    const { title, description, link, email } = await req.json();

    if (!title || !description || !link || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Find the user by email using Cypher query
    const userResult = await session.run(
      `
      MATCH (u:User {email: $email})
      RETURN u
      `,
      { email }
    );

    if (userResult.records.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const newProject = { title, description, link };
    await session.run(
      `
      MATCH (u:User {email: $email})
      CREATE (p:Project {title: $title, description: $description, link: $link})
      MERGE (u)-[:HAS_PROJECT]->(p)
      `,
      { email, title, description, link }
    );

    return NextResponse.json(newProject, { status: 201 });
  } catch (error: any) {
    console.error('Error creating project:', error.message);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  } finally {
    await session.close(); // Ensure the session is closed
    await driver.close();  // Close the driver connection if you no longer need it
  }
}

