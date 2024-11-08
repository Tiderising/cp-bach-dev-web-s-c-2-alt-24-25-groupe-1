import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      { message: "Connectez-vous pour accéder à cette route" },
      { status: 401 }
    );
  }

  const userId = (session.user as { id?: string }).id;

  if (!userId) {
    return NextResponse.json(
      { message: "ID utilisateur non trouvé" },
      { status: 400 }
    );
  }

  try {
    await prisma.notification.updateMany({
      where: { userId },
      data: { isRead: true },
    });

    return NextResponse.json(
      { message: "Toutes les notifications ont été marquées comme lues" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Erreur:", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}