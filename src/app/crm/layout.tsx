"use client"
import SideBar from "@/components/SideBar";
import { Status } from "@prisma/client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = useSession();
  const status = (session.data?.user as { status?: string })?.status;
  const twoFactorEnabled = (session.data?.user as { twoFactorEnabled?: boolean })?.twoFactorEnabled;

  // console.log("Role:", role);
  // console.log("Status:", status);
  // console.log("Two-factor enabled:", twoFactorEnabled);

  if(twoFactorEnabled && status!== Status.ACTIVE) {
    redirect("/account/2auth");
  }
  

  return (
    <div className="flex size-full flex-row">
      <SideBar />
      {children}
    </div>
  );
}
