import express from "express"
import { PrismaClient } from "@prisma/client"
import { authMiddleware } from "../middlewares/authMiddleware"
import { isAdmin } from "../middlewares/isAdmin"
import { announcementSchema } from "../validators/ValidateUser"

const prisma= new PrismaClient()
const router= express.Router()

router.post("/announcement", authMiddleware, isAdmin, async(req,res)=>{
    try{
        const parsed=announcementSchema.safeParse(req.body)
        if(!parsed.success){
            return res.status(400).json({ errors: parsed.error.errors });
        }

        const {title,message}=parsed.data

        const announcement=await prisma.announcement.create({
            data:{
                title,
                message,
                postedById: req.user.id
            }
        })
        res.status(201).json({message:"Announcement created", announcement})
    }catch(error){
        console.error("Error creating announcement:", err);
        res.status(500).json({ message: "Internal Server Error" })       
    }
})

router.get("/announcement", async(req,res)=>{
    try{
        const announcements= await prisma.announcement.findMany({
            include:{
                postedBy:{
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
        res.status(200).json({announcements})
    }catch (err) {
        console.error("Error fetching announcements:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
})

router.get("/announcement/:id", async(req,res)=>{
    try{
        const announcement=await prisma.announcement.findUnique({
            where:{id:req.params.id},
            include:{
                postedBy:{
                    select:{id:true, name:true, email:true}
                }
            }
        })
        if(!announcement){
            return res.status(200).json({announcement})
        }
    } catch (err) {
        console.error("Error fetching announcement:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
})

router.put("/announcement/:id", authMiddleware, isAdmin, async (req,res)=>{
    try{
        const parsed=announcementSchema.safeParse(req.body)
        if (!parsed.success) {
        return res.status(400).json({ errors: parsed.error.errors });
        }
        const {title, message}=parsed.data

        const update=await prisma.announcement.update({
            where:{id:req.params.id},
            data:{title, message}
        })
        res.status(200),json({message:"Announcemnq updated", announcement: update})
    } catch (err) {
        console.error("Error updating announcement:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
})

router.delete("/announcement/:id", authMiddleware, isAdmin, async (req,res)=>{
    try{
        await prisma.announcement.delete({
            where:{id:req.params.id}
        })
        res.status(200).json({message:"Announcement deleted"})
    } catch (err) {
        console.error("Error updating announcement:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
})


export default router