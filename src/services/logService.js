import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function logActivity(userId, action, details, keyId = null) {
  try {
    await prisma.activityLog.create({
      data: {
        userId,
        action,
        details,
        keyId,
      },
    });
  } catch (error) {
    console.error("Error logging activity:", error);
  }
}
