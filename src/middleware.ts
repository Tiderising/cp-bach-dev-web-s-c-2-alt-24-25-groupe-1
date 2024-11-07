import { Status } from "@prisma/client";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const { nextUrl } = req;
    const token = req.nextauth?.token;

    // Gestion de l'autorisation selon la route
    if (nextUrl.pathname.startsWith("/crm")) {
      if (!token || token.status !== Status.ACTIVE) {
        // Redirige vers une page de non-autorisation pour /crm si le statut n'est pas ACTIVE
        return NextResponse.redirect(new URL("/account/2auth", req.url));
      }
    } else if (nextUrl.pathname.startsWith("/account")) {
      if (!token) {
        // Redirige vers la page de connexion si l'utilisateur n'est pas authentifié pour /account
        return NextResponse.redirect(new URL("/login", req.url));
      }
    } else if (!token) {
      // Redirige vers la page de connexion pour toutes les autres routes protégées
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Si autorisé, continuer
    return NextResponse.next();
  },
  {
    callbacks: {
      async authorized({ token }) {
        // Ne pas gérer la logique d'autorisation ici, on l'a déplacée dans le middleware
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/crm/:path*", "/account/:path*"],
};
