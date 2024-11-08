import { authOptions } from "@/lib/auth";
import { mailOptions, transporter } from "@/lib/nodemailer";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
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
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    const unreadCount = notifications.filter(notification => !notification.isRead).length;
    console.log(notifications);

    return NextResponse.json({
      data: notifications,
      unreadCount,
      status: 200,
    });
  } catch (error) {
    console.log("Erreur:", error);
    return NextResponse.json({ message: "Erreur interne du serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const notifyByEmail = (session?.user as { notifyByEmail?: string }).notifyByEmail;
  const email = (session?.user as { email?: string }).email;
  const firstName = (session?.user as { firstName?: string }).firstName;
  const lastName = (session?.user as { lastName?: string }).lastName;

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
    const { title, message } = await req.json();

    if (!title || !message) {
      return NextResponse.json(
        { message: "Le titre et le message sont requis" },
        { status: 400 }
      );
    }

    const newNotification = await prisma.notification.create({
      data: {
        title,
        message,
        userId,
        isRead: false,
      },
    });

    // Send notification to user by email
    console.log(`notifyByEmail ? : ${notifyByEmail}`);

    if(notifyByEmail){
      await transporter.sendMail({
        ...mailOptions,
        to: email as string, // Recipient's email
        subject: title, // Subject
        text: `Bonjour ${firstName} ${lastName},\n\n${message}`, // Message
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Bonjour ${firstName} ${lastName},</h2>
            <p>${message}</p>
          </div>
        `, // HTML message
      });
    }

    return NextResponse.json({
      data: newNotification,
      status: 201,
    });
  } catch (error) {
    console.log("Erreur:", error);
    return NextResponse.json({ message: "Erreur interne du serveur" }, { status: 500 });
  }
}