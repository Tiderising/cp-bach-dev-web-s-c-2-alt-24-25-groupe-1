import { Button } from "@/components/ui/button";
import { Container } from "lucide-react";
import Link from "next/link";
import { FaLock } from "react-icons/fa6";
import { IoIosLock } from "react-icons/io";

export default function Home() {
  return (
    <main className="p-4 flex flex-col justify-center items-center gap-6">
      <header className="flex justify-between w-full">
        <div className="flex items-center gap-1">
          <IoIosLock size={30} className="text-blue-400" />
          <p className="font-semibold text-lg">Secu-tech</p>
        </div>
        <Button>
          <Link href="/login">Commencer</Link>
        </Button>
      </header>
      <div className="flex flex-col gap-6 items-center">
        <h1 className="text-4xl font-bold">Cryptographic Key Management</h1>
        <p className="text-lg font-light">
          Génerer, boutique, et partage des clefs sécurisées
        </p>
        <Button>Commencer</Button>
      </div>
      <IoIosLock size={500} className="text-blue-400/20 mt-4" />
    </main>
  );
}
