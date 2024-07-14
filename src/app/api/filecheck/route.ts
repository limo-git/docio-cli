// src/pages/api/check-file.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { filename } = req.query;

    if (!filename || typeof filename !== 'string') {
        res.status(400).json({ message: 'Filename is required' });
        return;
    }

    const filePath = path.join(process.cwd(), 'src/app/content/docs', `${filename}.mdx`);

    try {
        await fs.access(filePath);
        res.status(200).json({ exists: true });
    } catch (error) {
        res.status(404).json({ exists: false });
    }
}
