import { PrismaClient } from "@prisma/client"
import express from "express"
import { authMiddleware } from "../middlewares/authMiddleware"
import { isAdmin } from "../middlewares/isAdmin"
import { eventSchema } from "../validators/ValidateUser"


const prisma = new PrismaClient()
const router=express.Router()

router.post("/event", authMiddleware, isAdmin, async(req,res)=>{
    try{
        const parsed=eventSchema.safeParse(req.body)
        if(!parsed.success){
            return res.status(400).json({errors:parsed.error.errors})
        }

        const {title, content, eventDate}=parsed.data

        const event= await prisma.event.create({
            data:{
                title,
                content,
                eventDate: new Date(eventDate)
            }
        })
        res.status(201).json({message:"event created",event})
    } catch (err) {
        console.error("Error creating event:", err);
        res.status(500).json({ message: "Internal server error" });
    }
})

router.get("/event", async(req,res)=>{
    try{
        const events=await prisma.event.findMany({
            orderBy:{eventDate:"asc"}
        })
        res.status(200).json({events})
    } catch (err) {
        console.error("Error fetching events:", err);
        res.status(500).json({ message: "Internal server error" });
    }
})

router.get("/event/:id", async (req,res)=>{
    try{
        const event=await prisma.event.findUnique({
            where:{id:req.params.id}
        })

        if(!event){
            return res.status(404).json({message:"Event not found"})
        }
        res.status(200).json({event})
    } catch (err) {
        console.error("Error fetching event:", err);
        res.status(500).json({ message: "Internal server error" });
    }
})

router.put("/event/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    const parsed = eventSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.errors });
    }

    const { title, content, eventDate } = parsed.data;

    const updatedEvent = await prisma.event.update({
      where: { id: req.params.id },
      data: {
        title,
        content,
        eventDate: new Date(eventDate),
      },
    });

    res.status(200).json({ message: "Event updated", event: updatedEvent });
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/event/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    await prisma.event.delete({
      where: { id: req.params.id },
    });
    res.status(200).json({ message: "Event deleted" });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;