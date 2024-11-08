import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { createDecipheriv } from "crypto";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

export async function GET(
  req: NextRequest,
  { params }: { params: { keyId: number } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id?: string }).id;

  const keyId = params.keyId;

  const key = await prisma.key.findUnique({
    where: {
      id: Number(keyId),
    },
  });

  if (!key) {
    return NextResponse.json({ error: "Key not found" }, { status: 404 });
  }

  if (key.userId !== userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!ENCRYPTION_KEY) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  const algo = "aes-256-cbc";

  const [ivHex, encryptedHex] = key.encryptedPrivateKey.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const encrypted = Buffer.from(encryptedHex, "hex");

  const decipher = createDecipheriv(
    algo,
    Buffer.from(ENCRYPTION_KEY, "hex"),
    iv
  );
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return NextResponse.json(decrypted, { status: 200 });
}
