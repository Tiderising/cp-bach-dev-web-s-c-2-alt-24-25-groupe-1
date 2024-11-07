// app/providers.tsx
"use client";
// import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  // const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <div>
        <Toaster />
      </div>
      
      <div className="min-h-screen">
        {children}
      </div>
    </div>
  );
}