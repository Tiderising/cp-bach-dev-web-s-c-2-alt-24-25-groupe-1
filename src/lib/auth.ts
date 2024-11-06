import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Nodemailer from "next-auth/providers/nodemailer"
import { prisma } from "@/lib/prisma"
 
const emailHost = process.env.EMAIL_SERVER_HOST
const emailPort = process.env.EMAIL_SERVER_PORT
const emailUser = process.env.EMAIL_SERVER_USER
const emailPassword = process.env.EMAIL_SERVER_PASSWORD
const emailFrom = process.env.EMAIL_FROM

console.log(emailHost, emailPort, emailUser, emailPassword, emailFrom);


export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Nodemailer({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
})