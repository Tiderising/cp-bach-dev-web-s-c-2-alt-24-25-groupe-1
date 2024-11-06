import SideBar from "@/components/SideBar";
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-row h-full w-full">
      <SideBar />
      {children}
    </div>
  );
}
