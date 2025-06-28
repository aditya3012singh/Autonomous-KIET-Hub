import express from "express"
const router = express.Router();
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient();
import { authMiddleware } from "../middlewares/authMiddleware.js"

router.get('/recent', authMiddleware, async (req, res) => {
  try {
    const activities = await prisma.activity.findMany({
      where: { userId: req.user.id },
      orderBy: { time: 'desc' },
      take: 10,
    });

    res.json(activities);
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ message: 'Failed to load recent activity' });
  }
});

export default router;
