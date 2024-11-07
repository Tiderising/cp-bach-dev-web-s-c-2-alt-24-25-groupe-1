import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware({ nextUrl: { } }) {
    NextResponse.next();
  },
  {
    callbacks: {
      async authorized({ token, req: { } }) {
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