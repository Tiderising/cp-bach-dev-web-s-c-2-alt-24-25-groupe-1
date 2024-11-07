import { NextAuthOptions } from "next-auth";
import { PrismaClient, Status } from "@prisma/client";
import { compare } from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import { withAccelerate } from "@prisma/extension-accelerate";
import axios from "axios";
import { mailOptions, transporter } from "./nodemailer";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const prisma = new PrismaClient().$extends(withAccelerate());

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        try {
          const { email, password } = credentials;
          const user = await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
              status: true,
              password: true,
              notifyByEmail: true,
            },
          });

          if (!user) {
            throw new Error("Identifiant incorrect");
          }

          const passwordMatch = await compare(password, user.password);

          if (!passwordMatch) {
            throw new Error("Mot de passe incorrect");
          }

          const twoFactorCode = Math.floor(
            10000000 + Math.random() * 90000000
          ).toString(); // 8 chiffres
          const twoFactorCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);

          // Mise à jour de l'utilisateur avec Prisma
          const updateUser = await prisma.user.update({
            where: { id: user.id },
            data: {
              status: Status.INACTIVE,
              twoFactorCode,
            },
          });

          console.log(updateUser);

          // Send email verification email
          await transporter.sendMail({
            ...mailOptions,
            to: user.email as string, // Recipient's email
            subject: "Votre Code de Validation", // Subject
            text: `Bonjour ${user.firstName} ${user.lastName},\n\nPour confirmer votre identité, veuillez entrer le code de validation suivant : ${twoFactorCode}.\n\nVous pouvez également cliquer sur le lien suivant pour activer votre compte : ${process.env.NEXT_URL}/activation?code=${twoFactorCode}\n\nMerci de votre confiance.\n\nCordialement,\nL'équipe Secu-tech`, // Plain text body
            html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Bonjour ${user.firstName} ${user.lastName},</h2>
            <p>Pour confirmer votre identité, veuillez entrer le code de validation suivant :</p>
            <h3 style="color: #4CAF50;">${twoFactorCode}</h3>
            <p>Vous pouvez également cliquer sur le lien ci-dessous pour activer votre compte :</p>
            <a href="${process.env.NEXT_URL}/activation?code=${twoFactorCode}" style="color: #1E90FF;">Activer mon compte</a>
            <p>Merci de votre confiance.</p>
            <p>Cordialement,<br>L'équipe Secu-tech</p>
          </div>
        `, // HTML body
          });

          return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            status: user.status,
            notifyByEmail: user.notifyByEmail,
          };
        } catch (error) {
          throw error;
        } finally {
          await prisma.$disconnect();
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const prisma = new PrismaClient().$extends(withAccelerate());

      if (user) {
        token.id = user.id;
        token.firstName = (user as { firstName?: string }).firstName;
        token.lastName = (user as { lastName?: string }).lastName;
        token.role = (user as { role?: string }).role;
        token.status = (user as { status?: string }).status;
        token.notifyByEmail = (
          user as { notifyByEmail?: boolean }
        ).notifyByEmail;
      } else {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
        });

        if (dbUser) {
          token.role = dbUser.role;
          token.status = dbUser.status;
          token.notifyByEmail = dbUser.notifyByEmail;
          if (dbUser.firstName && dbUser.lastName) {
            token.firstName = dbUser.firstName;
            token.lastName = dbUser.lastName;
          }
        }
      }

      await prisma.$disconnect();

      return token;
    },

    async session({ session, token }) {
      if (session?.user && token) {
        (session.user as { id?: string }).id = token.sub;
        (session.user as { firstName?: string }).firstName =
          token.firstName as string;
        (session.user as { lastName?: string }).lastName =
          token.lastName as string;
        (session.user as { role?: string }).role = token.role as string;
        (session.user as { status?: string }).status = token.status as string;
        (session.user as { notifyByEmail?: boolean }).notifyByEmail =
          token.notifyByEmail as boolean;
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
