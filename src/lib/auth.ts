import { NextAuthOptions } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import { withAccelerate } from "@prisma/extension-accelerate";

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
          });

          if (!user) {
            throw new Error("Identifiant incorrect");
          }

          const passwordMatch = await compare(password, user.password);

          if (!passwordMatch) {
            throw new Error("Mot de passe incorrect");
          }

          return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            status: user.status,
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
      } else {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
        });

        if (dbUser) {
          token.role = dbUser.role;
          token.status = dbUser.status;
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
        (session.user as { firstName?: string }).firstName = token.firstName as string;
        (session.user as { lastName?: string }).lastName = token.lastName as string;
        (session.user as { role?: string }).role = token.role as string;
        (session.user as { status?: string }).status = token.status as string;
      }
      
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};