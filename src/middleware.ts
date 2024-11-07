import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { Status } from "@prisma/client";

export default withAuth(
  async function middleware(req) {
    const { nextUrl } = req;
    const token = req.nextauth?.token;
    const status = req.nextauth?.token?.status;

    console.log(status);
    

    // Vérification du statut de l'utilisateur pour l'accès à /crm
    if (nextUrl.pathname.startsWith("/crm")) {
      if (!token || token.status !== Status.ACTIVE) {
        return NextResponse.redirect(new URL("/account/2auth", req.url));
      }
    } else if (nextUrl.pathname.startsWith("/account") && !token) {
      return NextResponse.redirect(new URL("/login", req.url));
    } else if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      async authorized() {
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/crm/:path*", "/account/:path*"],
};