import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { BsThreeDots } from "react-icons/bs";
import { IoKeyOutline } from "react-icons/io5";
import { TbCirclePlus } from "react-icons/tb";

const keys = [
  {
    name: "API Gateway",
    algorithm: "RSA",
    length: 2048,
    createdAt: "2024-10-30",
  },
  {
    name: "API Gateway",
    algorithm: "RSA",
    length: 2048,
    createdAt: "2024-10-30",
  },
  {
    name: "API Gateway",
    algorithm: "RSA",
    length: 2048,
    createdAt: "2024-10-30",
  },
  {
    name: "API Gateway",
    algorithm: "RSA",
    length: 2048,
    createdAt: "2024-10-30",
  },
  {
    name: "API Gateway",
    algorithm: "RSA",
    length: 2048,
    createdAt: "2024-10-30",
  },
];

export default function ManageKeys() {
  return (
    <main className="flex size-full flex-col gap-4 bg-secondary p-4">
      <div className="flex items-center gap-4 pt-4">
        <IoKeyOutline size={24} />
        <p className="text-2xl font-semibold">Gérer les clés</p>
      </div>
      <div className="flex w-full items-center justify-between gap-4">
        <Input
          className="w-80"
          type="text"
          placeholder="Rechercher une clef..."
        />
        <Button>
          <TbCirclePlus />
          <Link href={"/crm/generate-key"}>Générer une clé</Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="h-14">
            <TableHead>Nom de la clé</TableHead>
            <TableHead>Type d&apos;algorithme</TableHead>
            <TableHead>Longueur de la clé</TableHead>
            <TableHead>Date de création</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {keys.map((key, index) => (
            <TableRow key={index}>
              <TableCell className="h-16 font-medium">{key.name}</TableCell>
              <TableCell className="h-16">{key.algorithm}</TableCell>
              <TableCell className="h-16">{key.length}</TableCell>
              <TableCell className="h-16">{key.createdAt}</TableCell>
              <TableCell className="flex h-16 items-center justify-center">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <BsThreeDots />
                  </DropdownMenuTrigger>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}
