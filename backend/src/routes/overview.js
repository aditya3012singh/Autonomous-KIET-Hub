// File: routes/overview.ts
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const [notes, tips, events, announcements] = await Promise.all([
      prisma.note.count(),
      prisma.tip.count(),
      prisma.event.count(),
      prisma.announcement.count(),
    ]);

    res.json({ notes, tips, events, announcements });
  } catch (err) {
    console.error('Dashboard overview error:', err);
    res.status(500).json({ error: 'Failed to load dashboard stats' });
  }
});

export default router;
