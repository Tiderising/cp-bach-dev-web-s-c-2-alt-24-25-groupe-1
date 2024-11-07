import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { LuImport } from "react-icons/lu";
import { TbCirclePlus } from "react-icons/tb";

const keys = [
  {
    name: "API Gateway",
    algorithm: "RSA",
    length: "2048 bits",
    createdAt: "2024-10-30",
  },
  {
    name: "API Gateway",
    algorithm: "RSA",
    length: "2048 bits",
    createdAt: "2024-10-30",
  },
  {
    name: "API Gateway",
    algorithm: "RSA",
    length: "2048 bits",
    createdAt: "2024-10-30",
  },
  {
    name: "API Gateway",
    algorithm: "RSA",
    length: "2048 bits",
    createdAt: "2024-10-30",
  },
  {
    name: "API Gateway",
    algorithm: "RSA",
    length: "2048 bits",
    createdAt: "2024-10-30",
  },
];

const Page = () => {
  return (
    <main className="flex size-full flex-col gap-4 bg-secondary p-4">
      <header className="flex items-center justify-between pt-4">
        <h1 className="text-2xl font-semibold">Bon retour parmis nous !</h1>
        <div className="flex gap-4">
          <Button>
            <TbCirclePlus />
            <Link href={"/crm/generate-key"}>Générer une nouvelle clé</Link>
          </Button>
          <Button variant={"outline"}>
            <LuImport />
            <Link href={"/crm/"}>Importer une clé</Link>
          </Button>
        </div>
      </header>
      <section className="flex gap-4">
        <Card className="w-full">
          <CardHeader>
            <h2 className="text-lg font-semibold">Total des clés</h2>
            <p className="text-3xl font-bold">5</p>
          </CardHeader>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <h2 className="text-lg font-semibold">Dernière clé</h2>
            <div>
              <p className="text-lg">API Gateway</p>
              <p>2024-10-30</p>
            </div>
          </CardHeader>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <h2 className="text-lg font-semibold">
              L&apos;algorithme le plus utilisé
            </h2>
            <p className="text-lg">RSA</p>
          </CardHeader>
        </Card>
      </section>
      <Card>
        <Table>
          <TableHeader>
            <TableRow className="h-14">
              <TableHead className="text-center">Nom de la clé</TableHead>
              <TableHead className="text-center">
                Type d&apos;algorithme
              </TableHead>
              <TableHead className="text-center">Longueur de la clé</TableHead>
              <TableHead className="text-center">Date de création</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {keys.map((key, index) => (
              <TableRow key={index}>
                <TableCell className="h-16 text-center font-medium">
                  {key.name}
                </TableCell>
                <TableCell className="h-16 text-center">
                  {key.algorithm}
                </TableCell>
                <TableCell className="h-16 text-center">{key.length}</TableCell>
                <TableCell className="h-16 text-center">
                  {key.createdAt}
                </TableCell>
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
      </Card>
    </main>
  );
};

export default Page;
