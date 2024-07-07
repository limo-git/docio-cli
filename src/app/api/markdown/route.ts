import { NextResponse } from "next/server";
import fs from 'fs/promises';
import path from 'path';
import sanitizeFilename from 'sanitize-filename';
import { exec } from 'child_process';

export async function POST(request: any) {
  try {
    const { fileName, content } = await request.json();

    // Sanitize filename to prevent security vulnerabilities
    const sanitizedFileName = sanitizeFilename(fileName);

    // Ensure valid file extension
    if (!sanitizedFileName) {
      throw new Error('Invalid filename provided.');
    }

    // Append .mdx extension
    const fileNameWithExtension = `${sanitizedFileName}.mdx`;

    // Directory where files will be saved (inside src)
    const docsDir = path.join(process.cwd(), 'src', 'content', 'docs');
    await fs.mkdir(docsDir, { recursive: true });

    // Construct file path
    const filePath = path.join(docsDir, fileNameWithExtension);

    // Write or append content to the file
    if (content) {
      await fs.writeFile(filePath, content);
    } else {
      await fs.writeFile(filePath, ''); // Save an empty file if no content provided
    }

    // Log current working directory
    console.log('Current working directory:', process.cwd());

    // Send success response
    const response = await NextResponse.json({ message: 'File created successfully' }, { status: 200 });

    // Execute chmod +x command (if needed)
    exec(`chmod +x ${path.join(process.cwd(), 'src', 'content')}`, (err, stdout, stderr) => {
      if (err) {
        console.error('Error executing chmod +x:', err);
        console.error('stderr:', stderr);
        console.log('stdout:', stdout);
        return;
      }
      console.log('chmod +x output:', stdout);

      // Execute contentlayer build command after chmod +x
      exec('npx contentlayer build', { cwd: process.cwd() }, (err, stdout, stderr) => {
        if (err) {
          console.error('Error executing contentlayer build:', err);
          console.error('stderr:', stderr);
          console.log('stdout:', stdout);
          return;
        }
        console.log('Contentlayer build output:', stdout);
      });
    });

    return response;
  } catch (error: any) {
    console.error('Error creating file:', error.message);

    // Send error response
    return NextResponse.json({ error: 'Failed to create file', message: error.message }, { status: 500 });
  }
}
