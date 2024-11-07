import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { mailOptions, transporter } from "@/lib/nodemailer";

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
        
        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
            },
        });

        await transporter.sendMail({
          ...mailOptions,
          to: email, // Recipient's email
          subject: "Bienvenue sur Secu-tech", // Subject
          text: `Bienvenue ${firstName} ${lastName}!\n\nNous sommes ravis de vous accueillir sur Secu-tech. Vous pouvez désormais vous connecter à votre compte et explorer nos services.\n\nPour commencer, veuillez visiter notre site : ${process.env.NEXT_URL}\n\nMerci de votre confiance.\n\nCordialement,\nL'équipe Secu-tech`, // Plain text body
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2>Bienvenue ${firstName} ${lastName}!</h2>
              <p>Nous sommes ravis de vous accueillir sur <strong>Secu-tech</strong>. Vous pouvez désormais vous connecter à votre compte et explorer nos services.</p>
              <p>Pour commencer, veuillez visiter notre site :</p>
              <a href="${process.env.NEXT_URL}" style="color: #1E90FF;">Secu-tech</a>
              <p>Merci de votre confiance.</p>
              <p>Cordialement,<br>L'équipe Secu-tech</p>
            </div>
          `, // HTML body
        });
        
        return NextResponse.json({ status: 201 , message : "Utilisateur créé avec succès" });

    } catch (error) {
        console.error("Erreur lors de la création de l'utilisateur :", error);
        return NextResponse.json(
            { error: "Erreur lors de la création de l'utilisateur" },
            { status: 500 }
        );
    }
}