// app/providers.tsx
"use client";
// import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  // const pathname = usePathname();

  return (
    <div className="size-full">
      <div>
        <Toaster />
      </div>

      <div className="size-full">{children}</div>
    </div>
  );
}
