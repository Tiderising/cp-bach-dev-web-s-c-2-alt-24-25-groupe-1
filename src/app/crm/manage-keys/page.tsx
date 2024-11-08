"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import axios from "axios";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { FaRegEye } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { IoKeyOutline } from "react-icons/io5";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { TbCirclePlus } from "react-icons/tb";

type Key = {
  id: number;
  keyName: string;
  algorithm: string;
  keySize: number;
  createdAt: Date;
};

export const columns: ColumnDef<Key>[] = [
  {
    accessorKey: "keyName",
    header: "Nom de la clé",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.keyName}</div>
    ),
  },
  {
    accessorKey: "algorithm",
    header: "Type d'algorithme",
    cell: ({ row }) => <div>{row.original.algorithm.toUpperCase()}</div>,
  },
  {
    accessorKey: "keySize",
    header: "Longueur de la clé",
    cell: ({ row }) => <div>{row.original.keySize} bits</div>,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date de création
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div>{new Date(row.original.createdAt).toLocaleDateString()}</div>
    ),
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="size-8 p-0">
              <BsThreeDots className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <MdDriveFileRenameOutline />
              <Link href={`/crm/manage-keys/${row.original.id}/rename`}>
                Renommer
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FaRegTrashCan />
              <Link href={`/crm/manage-keys/${row.original.id}/delete`}>
                Supprimer
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FaRegEye />
              <Link href={`/crm/manage-keys/${row.original.id}`}>Afficher</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];

export default function ManageKeys() {
  const [keys, setKeys] = useState<Key[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    axios.get("/api/keys").then((res) => {
      setKeys(res.data);
      setIsLoading(false);
    });
  }, []);

  const table = useReactTable({
    data: keys,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <main className="flex size-full flex-col gap-4 bg-secondary p-4">
      <div className="flex items-center gap-4 pt-4">
        <IoKeyOutline size={24} />
        <p className="text-2xl font-semibold">Gérer les clés</p>
      </div>
      <div className="flex w-full items-center justify-between gap-4">
        <Input
          className="w-80 bg-card"
          placeholder="Rechercher une clé"
          value={(table.getColumn("keyName")?.getFilterValue() as string) ?? ""}
          onChange={(e) => {
            table.getColumn("keyName")?.setFilterValue(e.target.value);
          }}
        />
        <Button>
          <TbCirclePlus />
          <Link href={"/crm/generate-key"}>Générer une clé</Link>
        </Button>
      </div>
      <Card className="h-screen overflow-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-16 text-center">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5)
                .fill(0)
                .map((_, index) => (
                  <TableRow key={index}>
                    {columns.slice(0, -1).map((column, cellIndex) => (
                      <TableCell key={cellIndex} className="h-16 text-center">
                        <Skeleton className="h-4" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="h-16 text-center">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Aucune clé trouvée.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </main>
  );
}
