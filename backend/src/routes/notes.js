import express from "express";
import { PrismaClient } from "@prisma/client";
import { uploadNoteSchema } from "../validators/ValidateUser.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { s3Upload } from "../middlewares/s3upload.js";
import { log } from "console";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/note/upload", authMiddleware, s3Upload.single("file"), async (req, res) => {
  try {
    const { title, branch, semester, subjectId } = req.body;

    if (!title || !branch || !semester || !subjectId || !req.file || !req.file.location) {
      return res.status(400).json({ message: "Missing required fields or file" });
    }

    const note = await prisma.note.create({
      data: {
        title,
        branch,
        semester: parseInt(semester),
        subjectId,
        fileUrl: req.file.location, // ✅ file URL from S3
        uploadedById: req.user.id,
      },
    });

    return res.status(201).json({
      message: "Note uploaded successfully",
      note,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Internal Server Error" });
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



export default router;
