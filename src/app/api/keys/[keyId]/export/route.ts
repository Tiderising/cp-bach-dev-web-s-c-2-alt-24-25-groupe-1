import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import archiver from "archiver";
import { createDecipheriv, randomBytes } from "crypto";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import forge from "node-forge";
import { Readable } from "stream";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { keyId: number } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const keyId = params.keyId;

  const key = await prisma.key.findUnique({
    where: {
      id: Number(keyId),
    },
  });

  if (!key) {
    return NextResponse.json({ error: "Key not found" }, { status: 404 });
  }

  const algo = "aes-256-cbc";
  const encryptKey = randomBytes(32);
  const iv = randomBytes(16);

  const decipher = createDecipheriv(algo, encryptKey, iv);
  let decryptedPrivateKey = decipher.update(
    key?.encryptedPrivateKey as string,
    "base64",
    "utf8"
  );
  decryptedPrivateKey += decipher.final("utf8");

  const pemPrivateKey = forge.pki.privateKeyToPem(
    forge.pki.privateKeyFromPem(decryptedPrivateKey)
  );

  const pemPublicKey = forge.pki.publicKeyToPem(
    forge.pki.publicKeyFromPem(key.publicKey)
  );

  const archive = archiver("zip", { zlib: { level: 9 } });
  const stream = new Readable().wrap(archive);

  archive.append(pemPrivateKey, { name: `private-key-${keyId}.pem` });
  archive.append(pemPublicKey, { name: `public-key-${keyId}.pem` });
  archive.finalize();

  return NextResponse.json(stream, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${key.keyName}.zip"`,
    },
  });
}
