import SideBar from '@/components/SideBar';
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        <SideBar />
        {children}
    </>
  );
}
