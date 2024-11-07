import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { mailOptions, transporter } from "@/lib/nodemailer";
import { Status } from "@prisma/client";

export async function POST(req: NextRequest) {
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
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    const twoFactorCode = Math.floor(
      10000000 + Math.random() * 90000000
    ).toString(); // 8 digits
    const twoFactorCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);

    console.log(`2AUTH Code: ${twoFactorCode}`);
    console.log(`2AUTH Expiry: ${twoFactorCodeExpiry}`);
    console.log(user);

    // 2AUTH System
    const updateUser = await prisma.user?.update({
      where: { id: user?.id },
      data: {
        status: Status.INACTIVE,
        twoFactorCode, // 8 digits
        twoFactorCodeExpiry, // 10 minutes
      },
    });

    console.log(updateUser);

    // // Send email verification email
    await transporter.sendMail({
      ...mailOptions,
      to: user?.email as string, // Recipient's email
      subject: "Votre Code de Validation", // Subject
      text: `Bonjour ${user?.firstName} ${user?.lastName},\n\nPour confirmer votre identité, veuillez entrer le code de validation suivant : ${user?.twoFactorCode}.\n\nVous pouvez également cliquer sur le lien suivant pour activer votre compte : ${process.env.NEXT_URL}/activation?code=${user?.twoFactorCode}\n\nMerci de votre confiance.\n\nCordialement,\nL'équipe Secu-tech`, // Plain text body
      html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Bonjour ${user?.firstName} ${user?.lastName},</h2>
            <p>Pour confirmer votre identité, veuillez entrer le code de validation suivant :</p>
            <h3 style="color: #4CAF50;">${user?.twoFactorCode}</h3>
            <p>Vous pouvez également cliquer sur le lien ci-dessous pour activer votre compte :</p>
            <a href="${process.env.NEXT_URL}/activation?code=${user?.twoFactorCode}" style="color: #1E90FF;">Activer mon compte</a>
            <p>Merci de votre confiance.</p>
            <p>Cordialement,<br>L'équipe Secu-tech</p>
          </div>
        `, // HTML body
    });

    return NextResponse.json(
      { message: "Two-factor code sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending two-factor code:", error);
    return NextResponse.json(
      { error: "Failed to send two-factor code" },
      { status: 500 }
    );
  }
}
