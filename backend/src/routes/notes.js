import express from "express";
import { PrismaClient } from "@prisma/client";
import { uploadNoteSchema } from "../validators/ValidateUser.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { s3Upload } from "../middlewares/s3upload.js";
import { log } from "console";
import { logActivity } from "../utils/logActivity.js";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/note/upload", authMiddleware, s3Upload.single("file"), async (req, res) => {
  try {
    const { title, semester, subjectId, branches } = req.body;

    if (!title || !branches || !semester || !subjectId || !req.file || !req.file.location) {
      return res.status(400).json({ message: "Missing required fields or file" });
    }

    const branchArray = JSON.parse(branches); // Expects branches to be a JSON stringified array from frontend

    if (!Array.isArray(branchArray) || branchArray.length === 0) {
      return res.status(400).json({ message: "Branches must be a non-empty array" });
    }

    const fileUrl = req.file.location;

    // Upload once, then insert for each branch
    const createdNotes = await Promise.all(
      branchArray.map((branch) =>
        prisma.note.create({
          data: {
            title,
            branch,
            semester: parseInt(semester),
            subjectId,
            fileUrl,
            uploadedById: req.user.id,
          },
        })
      )
    );

    await logActivity(req.user.id, 'Uploaded a note', title);

    return res.status(201).json({
      message: "Note uploaded successfully for all branches",
      notes: createdNotes,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


router.get("/note/debug", async (req, res) => {
  const allNotes = await prisma.note.findMany({
    select: { id: true, title: true }
  });
  res.json(allNotes);
});

router.get("/note/all", async (req,res)=>{
    try{
        const notes=await prisma.note.findMany({
            where:{
                approvedById:{not:null}//only approved ones
            },
            include:{
                subject:true,
                uploadedBy:{
                    select:{
                        id:true,
                        name:true,
                        email:true
                    }
                },
                approvedBy:{
                    select:{
                        id:true,
                        name:true,
                        email:true
                    }
                }
            },
            orderBy:{
                createdAt:"desc"
            }

        })
        return res.status(200).json({notes})
    }
    catch(error){
        console.error("Error fetching notes: ", error)
        return res.status(500).json({error:"Internal server error"})
    }
})

router.get("/note/:id", async (req,res)=>{
    try {
        const note=await prisma.note.findUnique({
            where:{
                id:req.params.id
            },
            include:{
                subject:true,
                uploadedBy:{
                    select:{
                        id:true,
                        name:true,
                        email:true
                    }
                },
                approvedBy:{
                    select:{
                        id:true,
                        name:true,
                        email:true
                    }
                },
                feedbacks:true
            }
        })
        if(!note){
            return res.status(404).json({message:"Notes not found"})
        }

        return res.status(200).json({note})
    }catch(e){
        console.error("Error fetching note: ",err)
        return res.status(500).json({error:"Internal server error"})
    }
})

router.put("/note/approve/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    const noteId = req.params.id;
    console.log("User attempting to approve:", req.user);
    console.log("Approving note ID:", noteId);

    const existingNote = await prisma.note.findUnique({
      where: { id: req.params.id }
    });
    console.log(existingNote)
    console.log("noteId received:", req.params.id);
    if (!existingNote) {
      console.log("Note not found in DB.");
      console.log("somethting")
      return res.status(404).json({ message: "Note not found" });
    }

    const note = await prisma.note.update({
      where: { id: req.params.id },
      data: {
        approvedById: req.user.id,
      },
    });

    return res.status(200).json({
      message: "Note approved successfully",
      note,
    });
  } catch (e) {
    console.error("Error approving note:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post('/bulk-approve', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { noteIds } = req.body;

    if (!Array.isArray(noteIds) || noteIds.length === 0) {
      return res.status(400).json({ message: 'noteIds must be a non-empty array.' });
    }

    const result = await prisma.note.updateMany({
      where: {
        id: { in: noteIds },
        approvedById: null, // Only approve unapproved notes
      },
      data: {
        approvedById: req.user.id, // Assuming admin ID is stored in req.user.id
      },
    });

    return res.status(200).json({
      message: `${result.count} notes approved.`,
    });
  } catch (error) {
    console.error('Bulk approve error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /note/filter?branch=IT&semester=4&subjectId=abc-uuid
router.get("/note/filter", async (req, res) => {
  const { branch, semester, subjectId } = req.query;

  try {
    const notes = await prisma.note.findMany({
      where: {
        ...(branch && { branch }),
        ...(semester && { semester: parseInt(semester) }),
        ...(subjectId && { subjectId }),
        approvedById: { not: null }, // only approved
      },
      include: {
        subject: true,
        uploadedBy: true,
        approvedBy: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({ notes });
  } catch (err) {
    console.error("Filter error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/note/count", async (req, res) => {
  try {
    const count = await prisma.note.count({
      where: {
        approvedById: { not: null }, // ✅ Only approved notes
      },
    });
    return res.status(200).json({ count });
  } catch (error) {
    console.error("Count fetch error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /note/:id
router.delete("/note/:id", authMiddleware, async (req, res) => {
  const noteId = req.params.id;

  try {
    const note = await prisma.note.findUnique({
      where: { id: noteId },
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Check if user is owner or admin
    if (req.user.id !== note.uploadedById && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Delete the note
    await prisma.note.delete({
      where: { id: noteId },
    });

    await logActivity(req.user.id, 'Deleted a note', note.title);

    return res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});



export default router;
