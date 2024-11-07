import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Status } from "@prisma/client";

export async function POST(req: Request) {
    const { code } = await req.json();

    try {
        const user = await prisma.user.findFirst({
            where: { twoFactorCode: code, status: Status.INACTIVE },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Code invalide ou expiré" },
                { status: 400 }
            );
        }

        await prisma.user.update({
            where: { id: user.id },
            data: { status: Status.ACTIVE, twoFactorCode: null },
        });

        return NextResponse.json({ message: "Compte activé avec succès" }, { status: 200 });
    } catch (error) {
        console.log("Erreur lors de l'activation du compte :", error);
        return NextResponse.json(
            { error: "Erreur lors de l'activation du compte" },
            { status: 500 }
        );
    }
}