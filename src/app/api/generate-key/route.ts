import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { generateKeyPair } from "crypto";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

enum KeyAlgorithm {
    RSA = "RSA",
    ECDSA = "ECDSA",
}

interface GenerateKeyRequest {
  algorithm: KeyAlgorithm;
  modulusLength?: 2048 | 3072 | 4096;
  namedCurve?: "P-256" | "P-384" | "P-521" | "secp256k1";
  keyName?: string;
}

interface GenerateKeyResponse {
  publicKey: string;
  privateKey: string;
  error?: string;
}

const prisma = new PrismaClient();

const generateKey = async (
  algorithm: KeyAlgorithm,
  modulusLength?: number,
  namedCurve?: string
): Promise<GenerateKeyResponse> => {
  return new Promise((resolve, reject) => {
    if (algorithm === KeyAlgorithm.RSA) {
      generateKeyPair(
        "rsa",
        {
          modulusLength: modulusLength || 2048,
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
    } else if (algorithm === KeyAlgorithm.ECDSA) {
      generateKeyPair(
        "ec",
        {
          namedCurve: namedCurve || "secp256k1",
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

export async function POST(
  req: NextRequest,
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = session.user;
  const userId = (user as { id: string }).id;

  // Parse the request body
  const { algorithm, modulusLength, namedCurve, keyName } = await req.json();

  if (!algorithm || (algorithm !== KeyAlgorithm.RSA && algorithm !== KeyAlgorithm.ECDSA)) {
    return NextResponse.json(
        {message: "Invalid parameter: algorithm must be 'RSA' or 'ECDSA'"}, 
        { status: 400 }
    );
  }

  if (
    algorithm === KeyAlgorithm.RSA &&
    modulusLength &&
    (![1024, 2048, 4096].includes(modulusLength) || modulusLength % 1024 !== 0)
  ) {
    return NextResponse.json({
      error: "Invalid RSA modulus length. Use 1024, 2048, or 4096.",
    }, { status: 400 });
  }

  if (
    algorithm === KeyAlgorithm.ECDSA &&
    namedCurve &&
    !["secp256k1", "P-256", "P-384", "P-521"].includes(namedCurve)
  ) {
    return NextResponse.json({
      message:
        "Invalid named curve for ECDSA. Use 'secp256k1', 'P-256', 'P-384', or 'P-521'.",
    }, { status: 400 });
  }

  try {
    const keys = await generateKey(algorithm, modulusLength, namedCurve);

    console.log(keys);

    const keySaved = await prisma.key.create({
      data: {
        userId,
        keyName,
        algorithm,
        keySize: algorithm === KeyAlgorithm.RSA ? modulusLength : namedCurve,
        curve: namedCurve
      },
    });

    console.log(keySaved);
    

    return NextResponse.json({ message: "Key generated successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error while generating key", details: error }, { status: 500 });
  }
}