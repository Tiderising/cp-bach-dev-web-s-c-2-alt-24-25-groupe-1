import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mailOptions, transporter } from "@/app/config/nodemailer";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
    const { email, password, firstName, lastName } = await req.json();

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