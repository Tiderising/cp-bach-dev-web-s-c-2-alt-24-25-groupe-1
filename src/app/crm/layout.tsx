import SideBar from "@/components/SideBar";
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex size-full flex-row">
      <SideBar />
      {children}
    </div>
  );
}
