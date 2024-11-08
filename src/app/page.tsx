import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IoIosLock } from "react-icons/io";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center gap-6 p-4">
      <header className="flex w-full justify-between">
        <div className="flex items-center gap-1">
          <IoIosLock size={30} className="text-blue-400" />
          <p className="text-lg font-semibold">Secu-tech</p>
        </div>
        <Button>
          <Link href="/login">Commencer</Link>
        </Button>
      </header>
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-4xl font-bold">Cryptographic Key Management</h1>
        <p className="text-lg font-light">
          Génerer, boutique, et partage des clefs sécurisées
        </p>
        <Button><Link href="/login">Commencer</Link></Button>
      </div>
      <IoIosLock size={500} className="mt-4 text-blue-400/20" />
    </main>
  );
}
