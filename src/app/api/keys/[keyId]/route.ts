import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

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

  return NextResponse.json(key, { status: 200 });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { keyId: number } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log(params.keyId);
  const keyId = params.keyId;

  const key = await prisma.key.delete({
    where: {
      id: Number(keyId),
    },
  });

  return NextResponse.json(
    { message: "Key deleted successfully", keyName: key.keyName,  },
    { status: 200 },
  );
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { keyId: number } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const keyId = params.keyId;

  const { keyName } = await req.json();

  await prisma.key.update({
    where: {
      id: Number(keyId),
    },
    data: {
      keyName,
    },
  });

  return NextResponse.json(
    { message: "Key renamed successfully" },
    { status: 200 }
  );
}
