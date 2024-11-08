import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
// import { Status } from "@prisma/client";

export default withAuth(
  async function middleware() {
    // const { nextUrl } = req;
    // const token = req.nextauth?.token;
    // const status = req.nextauth?.token?.status;
    

    // // Vérification du statut de l'utilisateur pour l'accès à /crm
    // if (nextUrl.pathname.startsWith("/crm")) {
    //   if (!token || status !== Status.ACTIVE) {
    //     return NextResponse.redirect(new URL("/account/2auth", req.url));
    //   }
    // } else if (nextUrl.pathname.startsWith("/account") && !token) {
    //   return NextResponse.redirect(new URL("/login", req.url));
    // } else if (!token) {
    //   return NextResponse.redirect(new URL("/login", req.url));
    // }

    return NextResponse.next();
  },
  {
    callbacks: {
      async authorized({ token, req: { nextUrl } }) {
        // if (nextUrl.pathname.includes("/profile")) {
        //   return token?.role === "instructor";
        // }

        if (nextUrl.pathname.includes("/crm")) {
          return !!token;
        }
        
        if (nextUrl.pathname.includes("/account")) {
          return !!token;
        }

        return token !== null;
      },
    },
  }
);

export const config = {
  matcher: ["/crm/:path*", "/account/:path*"],
};