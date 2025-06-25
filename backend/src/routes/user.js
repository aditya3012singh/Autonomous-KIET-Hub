// File: routes/auth.ts
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { PrismaClient } from '@prisma/client';
import Redis from "ioredis";
import { loginSchema, signupSchema } from "../validators/ValidateUser.js";
import { error } from "console";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";

dotenv.config();

const router = express.Router();
const prisma = new PrismaClient();
const redis = new Redis();
redis.ping().then(console.log); // Should log 'PONG'


// ✅ Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Route to generate OTP
router.post("/generate-otp", async (req, res) => {
  console.log("hello from otp")
  const email = req.body.email?.toLowerCase();

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(otpCode)
  try {
    console.log(process.env.EMAIL_USER)
    console.log(process.env.EMAIL_PASS)
    // Store OTP in Redis with 10-minute TTL
const result = await redis.set(`otp:${email}`, otpCode, "EX", 600);
console.log("✅ Redis SET result:", result); // Should log 'OK'

    console.log("Ram")
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your verification code is ${otpCode}`,
    });

    console.log("OTP sent to:", email);
    res.json({ message: "OTP sent to email!" });
  } catch (error) {
    console.log("hello")
    console.error("OTP error:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// ✅ Route to verify OTP
router.post("/verify-otp", async (req, res) => {
  const email = req.body.email?.toLowerCase();
  const code = req.body.code;
  console.log("Incoming OTP verify body:", req.body);

  try {
    const storedOtp = await redis.get(`otp:${email}`);

    console.log("✅ Email:", email);
    console.log("✅ Sent OTP code:", code);
    console.log("✅ Stored OTP from Redis:", storedOtp);

    if (!storedOtp || storedOtp !== code) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await redis.del(`otp:${email}`);
    await redis.set(`verified:${email}`, "true", "EX", 600);

    return res.json({ message: "OTP verified. You can now sign up." });
  } catch (error) {
    console.error("OTP verification failed:", error);
    return res.status(500).json({ message: "Failed to verify OTP." });
  }
});



// ✅ Check if admin already exists
router.get("/check-admin", async (req, res) => {
  try {
    const adminCount = await prisma.user.count({
      where: { role: "ADMIN" }
    });

    res.status(200).json({
      adminExists: adminCount > 0,
      adminCount,
    });
  } catch (error) {
    console.error("Error checking admin existence:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Signup route (with OTP check)
router.post("/signup", async (req, res) => {
  console.log("hello")
  try {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(403).json({ errors: parsed.error.errors });
    }

    const { email: rawEmail, name, password, role } = parsed.data;
    const email = rawEmail.toLowerCase(); // 🔥 Normalize email early

      // Use lowercased email consistently below
      const isVerified = await redis.get(`verified:${email}`);

      console.log("Checking verified status for:", email);
      console.log("Verified value in Redis:", isVerified);
      if (!isVerified) {
        return res.status(403).json({ message: "Please verify your email via OTP before signing up." });
      }


      // 🔒 Check if admin already exists
      if (role === "ADMIN") {
        const adminCount = await prisma.user.count({
          where: { role: "ADMIN" },
        });

        if (adminCount > 0) {
          return res.status(403).json({
            message: "Admin already exists. Only one admin is allowed per system.",
          });
        }
      }



    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: role ?? "STUDENT",
      },
    });

    const token = jwt.sign({ 
        id: user.id, 
        role: user.role },
        process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );

    await redis.del(`verified:${email}`);

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (e) {
    console.log(error)
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Signin route
router.post("/signin", async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.errors, message: "Invalid credentials" });
    }

    const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (!user) {
      return res.status(403).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(parsed.data.password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      jwt: token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed due to server error" });
  }
});


// Delete User route
router.delete("/user", authMiddleware, isAdmin, async (req, res) => {
  try {
    const parsed = deleteUserSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.errors });
    }

    const { userId } = parsed.data;

    await prisma.user.delete({
      where: { id: userId },
    });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})

export default router;


