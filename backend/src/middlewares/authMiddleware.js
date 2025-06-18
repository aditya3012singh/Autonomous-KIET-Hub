import {jwt } from "jsonwebtoken"
import dotenv from "dotenv"
import { PrismaClient } from "@prisma/client"

dotenv.config()
const prism=new PrismaClient()

export const authMiddleware= async (req,res,next)=>{
    const authHeader= req.headers["authorizaton"]
    if(!authHeader){
        return res.status(403).json({message:"no token provided"})
    } 
    try{
        const decoded =jwt.verify(authHeader, process.env.JWT_SECRET || "Secret")
        req.userId = decoded.id
        const user=await prisma.user.findUnique({
            where:{
                id:decoded.id
            }
        })
        if(!user){
            return res.status(404).json({message:"user not found"})
        }
        req.user=user
        next()
    } catch (e) {
        console.error("JWT verification error:", e);
        res.status(403).json({ message: "Invalid token" });
    }
}