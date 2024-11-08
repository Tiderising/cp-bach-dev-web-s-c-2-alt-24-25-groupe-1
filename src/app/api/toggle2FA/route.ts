import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await getServerSession(authOptions);
  const twoFactorEnabled = (session?.user as { twoFactorEnabled?: boolean })?.twoFactorEnabled;

  if (!session?.user) {
    return NextResponse.json(
      { message: "Connectez-vous pour accéder à cette route" },
      { status: 401 }
    );
  }

  const userId = (session.user as { id?: string }).id;

  if (!userId || typeof userId !== "string") {
    return NextResponse.json(
      { message: "ID utilisateur non trouvé ou format incorrect" },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if(twoFactorEnabled && user?.twoFactorCode) {
        return NextResponse.json(
          { message: "Désactivez la double authentification avant de continuer" },
          { status: 400 }
        );
      }

    if (!user) {
      return NextResponse.json(
        { message: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: !user.twoFactorEnabled
      },
    });

    return NextResponse.json({
      message: `Double authentification ${updatedUser.twoFactorEnabled ? 'activée' : 'désactivée'} avec succès`,
      twoFactorEnabled: updatedUser.twoFactorEnabled,
      status: 200,
    });
  } catch (error) {
    console.error("Erreur Prisma:", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}