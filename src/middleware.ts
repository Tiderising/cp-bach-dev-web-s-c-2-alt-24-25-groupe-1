import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { prisma } from "./lib/prisma"; // Import the Prisma client
import { Role } from "@prisma/client";

export default withAuth(
  async function middleware({ nextUrl: { pathname, searchParams } }) {
    NextResponse.next();
  },
  {
    callbacks: {
      async authorized({ token, req: { nextUrl } }) {
        if (!token) return false;

        // // Check if the user has access to CRM or account routes
        // if (nextUrl.pathname.includes("/crm") || nextUrl.pathname.includes("/auth")) {
        //   return user.role === Role.ADMIN; // Example role check
        // }

        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/crm/:path*"],
};