import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
    const { email, password, firstName, lastName } = await req.json();

    // Password strength validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(password)) {
        return NextResponse.json(
            { error: "Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial." },
            { status: 400 }
        );
    }

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return NextResponse.json(
            { error: "L'utilisateur existe déjà" },
            { status: 400 }
        );
    }

    const hashedPassword = await hash(password, 10);

    try {
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
            },
        });
        
        return NextResponse.json(newUser, { status: 201 });

    } catch (error) {
        console.error("Erreur lors de la création de l'utilisateur :", error);
        return NextResponse.json(
            { error: "Erreur lors de la création de l'utilisateur" },
            { status: 500 }
        );
    }
}