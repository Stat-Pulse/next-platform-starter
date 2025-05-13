// pages/api/liveScoring.js

import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'liveScoring.json');
    const fileContents = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContents);

    res.status(200).json(data);
  } catch (error) {
    console.error('Error loading liveScoring.json:', error);
    res.status(500).json({ error: 'Failed to load live scoring data' });
  }
}
