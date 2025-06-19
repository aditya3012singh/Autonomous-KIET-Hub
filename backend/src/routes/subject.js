import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { subjectSchema } from "../validators/ValidateUser.js";

const prisma = new PrismaClient();
const router = express.Router();

// Create Subject
router.post("/subject", authMiddleware, isAdmin, async (req, res) => {
  try {
    const parsed = subjectSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(403).json({ errors: parsed.error.errors });
    }

    const { name, branch, semester } = parsed.data;

    const subject = await prisma.subject.create({
      data: {
        name,
        branch,
        semester: parseInt(semester),
      },
    });

    res.status(201).json({ message: "Subject created", subject });
  } catch (e) {
    console.error("Error creating subject:", e);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get All Subjects
router.get("/subject", async (req, res) => {
  try {
    const subjects = await prisma.subject.findMany({
      orderBy: { semester: "asc" },
    });
    res.status(200).json({ subjects });
  } catch (e) {
    console.error("Error fetching subjects:", e);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get Subject by ID
router.get("/subject/:id", async (req, res) => {
  try {
    const subject = await prisma.subject.findUnique({
      where: { id: req.params.id },
    });

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.status(200).json({ subject });
  } catch (e) {
    console.error("Error fetching subject:", e);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update Subject by ID
router.put("/subject/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    const parsed = subjectSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.errors });
    }

    const { name, branch, semester } = parsed.data;

    const updatedSubject = await prisma.subject.update({
      where: { id: req.params.id },
      data: {
        name,
        branch,
        semester: parseInt(semester),
      },
    });

    res.status(200).json({ message: "Subject updated", subject: updatedSubject });
  } catch (e) {
    console.error("Error updating subject:", e);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete Subject by ID
router.delete("/subject/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    await prisma.subject.delete({
      where: { id: req.params.id },
    });
    res.status(200).json({ message: "Subject deleted" });
  } catch (e) {
    console.error("Error deleting subject:", e);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Optional: Filter Subjects by Branch & Semester
router.get("/subject/filter", async (req, res) => {
  const { branch, semester } = req.query;

  try {
    const filteredSubjects = await prisma.subject.findMany({
      where: {
        ...(branch && { branch }),
        ...(semester && { semester: parseInt(semester) }),
      },
      orderBy: { semester: "asc" },
    });

    res.status(200).json({ subjects: filteredSubjects });
  } catch (e) {
    console.error("Error filtering subjects:", e);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
