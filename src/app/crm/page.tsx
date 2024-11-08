"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LuImport } from "react-icons/lu";
import { TbCirclePlus } from "react-icons/tb";

type Key = {
  id: number;
  keyName: string;
  algorithm: string;
  keySize: number;
  createdAt: Date;
};

const Page = () => {
  const [keys, setKeys] = useState<Key[]>([]);
  const [lastKey, setLastKey] = useState<Key | null>(null);
  const [mostUsedAlgorithm, setMostUsedAlgorithm] = useState<string | null>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    axios.get("/api/keys").then((res) => {
      setKeys(res.data);
      setLastKey(res.data[0]);

      const algorithms = res.data.map((key: Key) => key.algorithm) as string[];
      const algorithmCounts = algorithms.reduce(
        (acc: Record<string, number>, curr: string) => {
          acc[curr] = (acc[curr] || 0) + 1;
          return acc;
        },
        {}
      );

      const mostUsedAlgorithm = Object.entries(algorithmCounts).reduce(
        (max, [algorithm, count]) =>
          count > max[1] ? [algorithm, count] : max,
        ["", 0]
      )[0];
      setMostUsedAlgorithm(mostUsedAlgorithm);
      setIsLoading(false);
    });
  }, []);

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
            <Link href={"/crm/import-key"}>Importer une clé</Link>
          </Button>
        </div>
      </header>
      <section className="flex gap-4">
        <Card className="w-full">
          <CardHeader>
            <h2 className="text-lg font-semibold">Total des clés</h2>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-3xl font-bold">{keys.length}</p>
            )}
          </CardHeader>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <h2 className="text-lg font-semibold">Dernière clé</h2>
            {isLoading ? (
              <div>
                <Skeleton className="mb-2 h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            ) : (
              <div>
                {lastKey ? (
                  <>
                    <p className="text-lg">{lastKey?.keyName}</p>
                    <p>{lastKey?.createdAt.toString().split("T")[0]}</p>
                  </>
                ) : (
                  <p className="text-lg">Aucune clé disponible</p>
                )}
              </div>
            )}
          </CardHeader>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <h2 className="text-lg font-semibold">
              L&apos;algorithme le plus utilisé
            </h2>
            {isLoading ? (
              <Skeleton className="h-6 w-32" />
            ) : (
              <p className="text-lg">
                {mostUsedAlgorithm?.toUpperCase() || "Aucune clé disponible"}
              </p>
            )}
          </CardHeader>
        </Card>
      </section>
      <Card className="flex flex-col items-center justify-center">
        <Table>
          <TableHeader>
            <TableRow className="h-14">
              <TableHead className="text-center">Nom de la clé</TableHead>
              <TableHead className="text-center">
                Type d&apos;algorithme
              </TableHead>
              <TableHead className="text-center">Longueur de la clé</TableHead>
              <TableHead className="text-center">Date de création</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5)
                .fill(0)
                .map((_, index) => (
                  <TableRow key={index}>
                    <TableCell className="h-16">
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                    <TableCell className="h-16">
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                    <TableCell className="h-16">
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                    <TableCell className="h-16">
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  </TableRow>
                ))
            ) : keys.length > 0 ? (
              keys.map((key, index) => (
                <TableRow key={index}>
                  <TableCell className="h-16 text-center font-medium">
                    {key.keyName}
                  </TableCell>
                  <TableCell className="h-16 text-center">
                    {key.algorithm.toUpperCase()}
                  </TableCell>
                  <TableCell className="h-16 text-center">
                    {key.keySize} bits
                  </TableCell>
                  <TableCell className="h-16 text-center">
                    {key.createdAt.toString().split("T")[0]}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-16 text-center">
                  Aucune clé n&apos;est disponible pour le moment.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {!isLoading && keys.length > 0 && (
          <Button variant="link">
            <Link href={"/crm/manage-keys"}>Voir plus</Link>
          </Button>
        )}
      </Card>
    </main>
  );
};

export default Page;
