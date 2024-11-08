import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { createCipheriv, generateKeyPair } from "crypto";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

type KeyAlgorithm = "rsa" | "ecdsa";

interface GenerateKeyRequest {
  algorithm: KeyAlgorithm;
  keyLength: number;
  keyName?: string;
}

interface GenerateKeyResponse {
  publicKey: string;
  privateKey: string;
  error?: string;
}

const prisma = new PrismaClient();

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

const generateKey = async (
  algorithm: KeyAlgorithm,
  keyLength: number | string
): Promise<GenerateKeyResponse> => {
  return new Promise((resolve, reject) => {
    if (algorithm === "rsa") {
      generateKeyPair(
        "rsa",
        {
          modulusLength: parseInt(keyLength as string),
          publicKeyEncoding: {
            type: "spki",
            format: "pem",
          },
          privateKeyEncoding: {
            type: "pkcs8",
            format: "pem",
          },
        },
        (err, publicKey, privateKey) => {
          if (err) {
            reject({ error: "Error while generating RSA key" });
          } else {
            resolve({ publicKey, privateKey });
          }
        }
      );
    } else if (algorithm === "ecdsa") {
      generateKeyPair(
        "ec",
        {
          namedCurve: `P-${keyLength}`,
          publicKeyEncoding: {
            type: "spki",
            format: "pem",
          },
          privateKeyEncoding: {
            type: "pkcs8",
            format: "pem",
          },
        },
        (err, publicKey, privateKey) => {
          if (err) {
            reject({ error: "Error while generating ECDSA key" });
          } else {
            resolve({ publicKey, privateKey });
          }
        }
      );
    } else {
      reject({ error: "Not supported algorithm" });
    }
  });
};

export const POST = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id?: string }).id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { algorithm, keyLength, keyName } =
    (await req.json()) as GenerateKeyRequest;

  if (!algorithm || (algorithm !== "rsa" && algorithm !== "ecdsa")) {
    return NextResponse.json({ error: "Invalid algorithm" }, { status: 400 });
  }

  if (algorithm === "rsa" && [2048, 3072, 4096].includes(keyLength)) {
    return NextResponse.json(
      { error: "Invalid key length for RSA" },
      { status: 400 }
    );
  }

  if (algorithm === "ecdsa" && [256, 384, 521].includes(keyLength)) {
    return NextResponse.json(
      { error: "Invalid key length for ECDSA" },
      { status: 400 }
    );
  }

  if (!ENCRYPTION_KEY) {
    return NextResponse.json(
      { error: "ENCRYPTION_KEY is missing in .env" },
      { status: 500 }
    );
  }

  try {
    const keys = await generateKey(algorithm, keyLength);

    const algo = "aes-256-cbc";
    const key = Buffer.from(ENCRYPTION_KEY, "hex");
    const iv = Buffer.from(ENCRYPTION_KEY, "hex").slice(0, 16);

    const cipher = createCipheriv(algo, Buffer.from(key), iv);
    let encrypted = cipher.update(keys.privateKey);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    keys.privateKey = iv.toString("hex") + ":" + encrypted.toString("hex");
    await prisma.key.create({
      data: {
        userId: userId,
        keyName: keyName || "Unnamed key",
        algorithm: algorithm,
        keySize: keyLength.toString(),
        publicKey: keys.publicKey,
        encryptedPrivateKey: encrypted.toString("hex"),
      },
    });

    return NextResponse.json(
      { message: "Key generated successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
};

export const GET = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const keys = await prisma.key.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      userId: (session.user as { id?: string }).id,
    },
  });

  console.log("keys", keys);

  return NextResponse.json(keys);
};
