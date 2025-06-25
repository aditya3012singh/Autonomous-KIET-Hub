import express from "express";
import { PrismaClient } from "@prisma/client";
import { uploadNoteSchema } from "../validators/ValidateUser.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { s3Upload } from "../middlewares/s3upload.js";

const router = express.Router();
const prisma = new PrismaClient();

// POST /note/upload → Upload a note (protected)
// router.post("/note/upload", authMiddleware, async (req, res) => {
//   try {
//     const parsed = uploadNoteSchema.safeParse(req.body);
//     if (!parsed.success) {
//       return res.status(403).json({ errors: parsed.error.errors });
//     }

//     let { title, branch, semester, subjectId, fileUrl } = parsed.data;
//     const userId = req.user.id;

//     // Support both string and array for branch
//     if (typeof branch === 'string') {
//       branch = [branch];
//     }

//     // Check if subject exists
//     const subject = await prisma.subject.findUnique({
//       where: { id: subjectId },
//     });

//     if (!subject) {
//       return res.status(404).json({ error: "Subject not found." });
//     }

//     const createdNotes = [];

//     for (const b of branch) {
//       const note = await prisma.note.create({
//         data: {
//           title,
//           branch: b,
//           semester,
//           fileUrl,
//           subjectId,
//           uploadedById: userId,
//         },
//       });
//       createdNotes.push(note);
//     }

//     return res.status(201).json({
//       message: "Notes uploaded to multiple branches successfully",
//       notes: createdNotes,
//     });
//   } catch (err) {
//     console.error("Upload error:", err);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// });
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

router.put("note/approve/:id", authMiddleware, isAdmin, async(req,res)=>{
    try{
        const noteId=req.params.id

        const note=await prisma.note.update({
            where:{id:noteId},
            data:{
                approvedById:req.user.id
            }
        })
        return res.status(200).json({
            message:"Note approved successfully",
            note
        })
    }catch(e){
        console.error("Error aproving notes: ",e)
        return res.status(500).json({error:"Internal server error"})
    }
})

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

router.post("/note/upload", authMiddleware, s3Upload.single("file"), async (req, res) => {
  try {
    const { title, branch, semester, subjectId } = req.body;

    // Validation
    if (!title || !branch || !semester || !subjectId || !req.file || !req.file.location) {
      return res.status(400).json({ message: "Missing required fields or file" });
    }

    const note = await prisma.note.create({
      data: {
        title,
        branch,
        semester: parseInt(semester),
        subjectId,
        fileUrl: req.file.location,
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


export default router;
