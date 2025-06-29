// File: routes/overview.ts
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const [uniqueNotes, tips, events, announcements] = await Promise.all([
      prisma.note.findMany({
        where: { approvedById: { not: null } }, // ✅ Only approved
        select: { fileUrl: true },
        distinct: ['fileUrl'], // ✅ Unique file URLs
      }),
      prisma.tip.count({ where: { approvedById: { not: null } } }),
      prisma.event.count(),
      prisma.announcement.count(),
    ]);

    res.json({
      notes: uniqueNotes.length, // ✅ Send count of unique approved notes
      tips,
      events,
      announcements,
    });
  } catch (err) {
    console.error('Dashboard overview error:', err);
    res.status(500).json({ error: 'Failed to load dashboard stats' });
  }
});

export default router;
