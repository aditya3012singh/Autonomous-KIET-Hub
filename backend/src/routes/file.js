import { PrismaClient } from "@prisma/client";
import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { s3Upload } from "../middlewares/s3upload.js";

const prisma = new PrismaClient();
const router = express.Router();

// Upload a file (pending approval)
router.post("/file", authMiddleware, s3Upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    const uploaded = await prisma.file.create({
      data: {
        filename: file.originalname,
        url: file.location,
        type: file.mimetype,
        size: file.size,
        uploadedById: req.user.id,
        approvedById: null, // Initially not approved
      },
    });

    res.status(201).json({ message: "File uploaded", file: uploaded });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all approved files (public route)
router.get("/files", async (req, res) => {
  try {
    const files = await prisma.file.findMany({
      where: { approvedById: { not: null } },
      orderBy: { createdAt: "desc" },
      include: {
        uploadedBy: { select: { id: true, name: true } },
        approvedBy: { select: { id: true, name: true } },
      },
    });

    res.status(200).json({ files });
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get unapproved files (admin only)
router.get("/files/pending", authMiddleware, isAdmin, async (req, res) => {
  try {
    const pendingFiles = await prisma.file.findMany({
      where: { approvedById: null },
      orderBy: { createdAt: "desc" },
      include: {
        uploadedBy: { select: { id: true, name: true } },
      },
    });

    res.status(200).json({ files: pendingFiles });
  } catch (error) {
    console.error("Error fetching pending files:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Get a single file by ID
router.get("/file/:id", async (req, res) => {
  try {
    const file = await prisma.file.findUnique({
      where: { id: req.params.id },
      include: {
        uploadedBy: { select: { id: true, name: true } },
      },
    });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // If not approved, don't show it publicly (optional)
    if (!file.approvedById) {
      return res.status(403).json({ message: "File not approved yet" });
    }

    res.status(200).json({ file });
  } catch (error) {
    console.error("Error fetching file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Approve a file (admin only)
router.put("/file/approve/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    const approved = await prisma.file.update({
      where: { id: req.params.id },
      data: { approvedById: req.user.id },
    });

    res.status(200).json({ message: "File approved", file: approved });
  } catch (error) {
    console.error("Error approving file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a file (admin only)
router.delete("/file/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    await prisma.file.delete({
      where: { id: req.params.id },
    });

    res.status(200).json({ message: "File deleted" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Bulk approve files (admin only)
router.put("/files/bulk-approve", authMiddleware, isAdmin, async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "Invalid or empty file IDs" });
  }

  try {
    const result = await prisma.file.updateMany({
      where: {
        id: { in: ids },
        approvedById: null,
      },
      data: {
        approvedById: req.user.id,
      },
    });

    res.status(200).json({ message: `${result.count} files approved.` });
  } catch (error) {
    console.error("Error bulk approving files:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


export default router;
