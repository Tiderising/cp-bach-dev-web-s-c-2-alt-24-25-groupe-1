"use client"
import SideBar from "@/components/SideBar";
import { useSession } from "next-auth/react";
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = useSession();
  const role = (session.data?.user as { role?: string })?.role;
  const status = (session.data?.user as { status?: string })?.status;

  return (
    <div className="flex size-full flex-row">
      <SideBar />
      {children}
    </div>
  );
}
