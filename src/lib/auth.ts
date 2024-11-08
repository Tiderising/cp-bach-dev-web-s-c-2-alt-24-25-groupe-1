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
              twoFactorEnabled: true,
            },
          });

          if (!user) {
            throw new Error("Identifiant incorrect");
          }

          const passwordMatch = await compare(password, user.password);

          if (!passwordMatch) {
            throw new Error("Mot de passe incorrect");
          }

          // Mise à jour de l'utilisateur avec Prisma
          await prisma.user.update({
            where: { id: user.id },
            data: {
              status: Status.INACTIVE,
            },
          });

          return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            status: user.status,
            notifyByEmail: user.notifyByEmail,
            twoFactorEnabled: user.twoFactorEnabled,
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
        token.notifyByEmail = (user as { notifyByEmail?: boolean }).notifyByEmail;
        token.twoFactorEnabled = (user as { twoFactorEnabled?: boolean }).twoFactorEnabled;
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
          token.twoFactorEnabled = dbUser.twoFactorEnabled;
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
          (session.user as { twoFactorEnabled?: boolean }).twoFactorEnabled = token.twoFactorEnabled as boolean;
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
