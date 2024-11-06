import { Button } from "@/components/ui/button";
import { IoKeyOutline } from "react-icons/io5";
import { TbCirclePlus } from "react-icons/tb";
import { Input } from "@/components/ui/input";
import { BsThreeDots } from "react-icons/bs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    <main className="p-4 size-full">
      <div className="flex items-center gap-4 mb-8">
        <IoKeyOutline size={40} />
        <p className="font-semibold text-4xl">Management des clefs</p>
      </div>

      <div className="flex items-center gap-4 mb-4 justify-between w-full">
        <Input
          className="w-80"
          type="text"
          placeholder="Rechercher une clef..."
        />
        <Button>
          <TbCirclePlus />
          Générer une clef
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-fit">Nom de la clé</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Longueur de la clé</TableHead>
            <TableHead>Date de création</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {keys.map((key, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{key.name}</TableCell>
              <TableCell>{key.algorithm}</TableCell>
              <TableCell>{key.length}</TableCell>
              <TableCell>{key.createdAt}</TableCell>
              <TableCell className="flex items-center justify-center">
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
