import { PrismaClient } from "@prisma/client"
import express from "express"
import { authMiddleware } from "../middlewares/authMiddleware"
import { isAdmin } from "../middlewares/isAdmin"
import { s3Upload } from "../middlewares/s3upload"
 

const prisma = new PrismaClient()
const router= express.Router()

router.post("/file", authMiddleware, isAdmin, s3Upload.single("file"), async (req,res)=>{
    try{
        const file=req.file

        const uploaded = await prisma.file.create({
            data:{
                filename:file.originalname,
                url:file.location,
                type:file.mimetype,
                size:file.size,
                uploadedById:req.user.id
            }
        })
        res.status(201).json({ message: "File uploaded", file: uploaded });
    } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

router.get("/files", async (req, res) => {
  try {
    const files = await prisma.file.findMany({
      orderBy: { createdAt: "desc" }
    });

    res.status(200).json({ files });
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.delete("/file/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    await prisma.file.delete({
      where: { id: req.params.id }
    });

    res.status(200).json({ message: "File deleted" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;