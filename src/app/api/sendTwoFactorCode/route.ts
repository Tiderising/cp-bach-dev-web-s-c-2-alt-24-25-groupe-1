import { authOptions } from "@/lib/auth";
import { mailOptions, transporter } from "@/lib/nodemailer";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest, res: NextResponse) {

  const session = await getServerSession(authOptions);

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

    if (!user) {
      return NextResponse.json(
        { message: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    const twoFactorCode = Math.floor(
      10000000 + Math.random() * 90000000
    ).toString(); // 8 chiffres
    const twoFactorCodeExpireTime = new Date(Date.now() + 10 * 60 * 1000); // Expiration du code dans 10 minutes

    // Vérification que les valeurs sont valides avant de mettre à jour
    if (!twoFactorCode || !twoFactorCodeExpireTime) {
      return NextResponse.json(
        { message: "Code ou expiration invalide" },
        { status: 400 }
      );
    }

    // Mise à jour de l'utilisateur avec Prisma
    const updateUser = await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorCode,
        twoFactorCodeExpireTime: twoFactorCodeExpireTime.toISOString(), // Expiration du code dans 10 minutes
      },
    });

    console.log(updateUser);

    // Send email verification email
    await transporter.sendMail({
      ...mailOptions,
      to: user.email as string, // Recipient's email
      subject: "Votre Code de Validation", // Subject
      text: `Bonjour ${user.firstName} ${user.lastName},\n\nPour confirmer votre identité, veuillez entrer le code de validation suivant : ${twoFactorCode}.\n\nVous pouvez également cliquer sur le lien suivant pour activer votre compte : ${process.env.NEXT_PUBLIC_NEXT_URL}/activation?code=${twoFactorCode}\n\nMerci de votre confiance.\n\nCordialement,\nL'équipe Secu-tech`, // Plain text body
      html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Bonjour ${user.firstName} ${user.lastName},</h2>
            <p>Pour confirmer votre identité, veuillez entrer le code de validation suivant :</p>
            <h3 style="color: #4CAF50;">${twoFactorCode}</h3>
            <p>Vous pouvez également cliquer sur le lien ci-dessous pour activer votre compte :</p>
            <a href="${process.env.NEXT_PUBLIC_NEXT_URL}/activation?code=${twoFactorCode}" style="color: #1E90FF;">Activer mon compte</a>
            <p>Merci de votre confiance.</p>
            <p>Cordialement,<br>L'équipe Secu-tech</p>
          </div>
        `, // HTML body
    });

    return NextResponse.json({
      message:
        "Code de validation envoyé avec succès, expirera dans 10 minutes",
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
