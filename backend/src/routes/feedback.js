import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { feedbackSchema } from "../validators/ValidateUser.js";

const router = express.Router();
const prisma = new PrismaClient();

// POST /feedback - Submit feedback for note or tip
router.post("/feedback", authMiddleware, async (req, res) => {
  try {
    const parsed = feedbackSchema.safeParse({ ...req.body, userId: req.user.id });
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.errors });
    }

    const { content, noteId, tipId } = parsed.data;

    const feedback = await prisma.feedback.create({
      data: {
        content,
        noteId,
        tipId,
        userId: req.user.id
      }
    });

    res.status(201).json({ message: "Feedback submitted", feedback });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /feedback/:id - Get all feedbacks for a note or tip
router.get("/feedback/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const feedbacks = await prisma.feedback.findMany({
      where: {
        OR: [
          { noteId: id },
          { tipId: id }
        ]
      },
      include: {
        user: {
          select: { name: true, email: true }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.status(200).json({ feedbacks });
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE /feedback/:id - Delete feedback by ID
router.delete("/feedback/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    await prisma.feedback.delete({
      where: { id: req.params.id }
    });

    res.status(200).json({ message: "Feedback deleted" });
  } catch (error) {
    console.error("Error deleting feedback:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
