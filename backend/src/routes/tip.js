import { PrismaClient } from "@prisma/client"
import express from "express"
import { authMiddleware } from "../middlewares/authMiddleware.js"
import { moderateTipSchema, tipSchema } from "../validators/ValidateUser.js"
import { isAdmin } from "../middlewares/isAdmin.js"
import {z} from "zod"
import { logActivity } from "../utils/logActivity.js"

const router=express.Router()
const prisma=new PrismaClient()

router.post("/tip", authMiddleware, async (req,res)=>{
    try{
        const parsed=tipSchema.safeParse(req.body)
        if(!parsed.success){
            res.status(400).json({errors: parsed.error.errors})
        }
        const {title, content}=parsed.data
        const tip=await prisma.tip.create({
            data:{
                title,
                content,
                postedById:req.user.id,
                status:"PENDING"
            }
        })
        return res.status(201).json({ message: "Tip submitted for approval", tip });
    } catch (error) {
        console.error("Error submitting tip:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})


// Bulk tips schema: array of tips
const bulkTipSchema = z.array(tipSchema);

// Route: POST /tip/bulk
router.post("/tip/bulk", authMiddleware, async (req, res) => {
  try {
    const parsed = bulkTipSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.errors });
    }

    const tipsToCreate = parsed.data.map(tip => ({
      ...tip,
      postedById: req.user.id,
      status: "PENDING"
    }));

    const result = await prisma.tip.createMany({
      data: tipsToCreate,
      skipDuplicates: true, // Optional
    });

    return res.status(201).json({
      message: "Tips submitted for approval",
      count: result.count,
    });

  } catch (error) {
    console.error("Error in /tip/bulk:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/tip/all", async (req,res)=>{
    try{
        console.log("hello");
        
        const tips=await prisma.tip.findMany({
            where:{status:"APPROVED"},
            orderBy:{createdAt:"desc"},
            include:{
                postedBy:{
                    select:{id:true, name:true, email:true}
                },
                approvedBy:{
                    select:{id:true, name:true}
                }
            }
        })
        res.status(200).json({ tips });
    } catch (error) {
        console.error("Error fetching tips:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

router.put("/tip/approve/:id", authMiddleware, isAdmin, async (req,res)=>{
    try{
        const parsed=moderateTipSchema.safeParse({tipId:req.params.id, ...req.body})
        if (!parsed.success) {
            return res.status(400).json({ errors: parsed.error.errors });
        }
        const {status}=parsed.data

        const updatedTip=await prisma.tip.update({
            where:{id:req.params.id},
            data:{
                status,
                approvedById:req.user.id
            }
        })
        res.status(200).json({ message: `Tip ${status.toLowerCase()}`, tip: updatedTip });
    } catch (error) {
        console.error("Error moderating tip:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

router.get("/tip/:id", authMiddleware, async (req, res) => {
  try {
    const tip = await prisma.tip.findUnique({
      where: { id: req.params.id }
    });

    if (!tip) {
      return res.status(404).json({ message: "Tip not found" });
    }

    res.status(200).json({ tip });
  } catch (e) {
    console.error("Error getting the tip:", e);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.delete("/tip/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    await prisma.tip.delete({
      where: { id: req.params.id }
    });

    res.status(200).json({ message: "Tip deleted successfully" });
  } catch (error) {
    console.error("Error deleting tip:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Schema for bulk approval input
const bulkModerateSchema = z.object({
  tipIds: z.array(z.string().uuid()),
  status: z.enum(["APPROVED", "REJECTED"])
});

router.put("/tip/approve", authMiddleware, isAdmin, async (req, res) => {
  try {
    const parsed = bulkModerateSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.errors });
    }

    const { tipIds, status } = parsed.data;

    const result = await prisma.tip.updateMany({
      where: {
        id: { in: tipIds },
      },
      data: {
        status,
        approvedById: req.user.id
      }
    });

    return res.status(200).json({
      message: `Tips ${status.toLowerCase()}`,
      count: result.count
    });

  } catch (error) {
    console.error("Error in /tip/approve:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get Pending Tips (Admin Only, with Pagination)
router.get("/tip/pending", authMiddleware, isAdmin, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const tips = await prisma.tip.findMany({
      where: { status: "PENDING" },
      skip,
      take: limit,
      include: {
        postedBy: true,
      },
      orderBy: { createdAt: "desc" },
    });
    const count = await prisma.tip.count({ where: { status: "PENDING" } });
    res.status(200).json({ tips, total: count, page, limit });
  } catch (e) {
    console.error("Error fetching pending tips:", e);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/tip/approve", authMiddleware, isAdmin, async (req, res) => {
  try {
    const { tipIds, status } = req.body;

    if (!Array.isArray(tipIds) || !['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ message: "Invalid request body" });
    }

    const updated = await prisma.tip.updateMany({
      where: {
        id: { in: tipIds },
      },
      data: {
        status,
        approvedById: req.user.id,
      },
    });
    await logActivity(req.user.id, 'Shared a tip', tip.title);

    return res.status(200).json({ message: `Tips ${status.toLowerCase()}`, count: updated.count });
  } catch (error) {
    console.error("Error bulk moderating tips:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;