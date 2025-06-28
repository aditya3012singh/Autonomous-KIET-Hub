import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient();

export const logActivity = async (userId, action, subject = null) => {
  try {
    await prisma.activity.create({
      data: {
        userId,
        action,
        subject,
      },
    });
  } catch (error) {
    console.error('Failed to log activity:', error.message);
  }
};


