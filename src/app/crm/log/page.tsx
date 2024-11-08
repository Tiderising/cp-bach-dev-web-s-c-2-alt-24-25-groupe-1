import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FaRegEye } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { FiDownload, FiUpload } from "react-icons/fi";
import { IoKeyOutline } from "react-icons/io5";
import { LuHistory } from "react-icons/lu";

const logs = [
  {
    type: "Génération de clé",
    date: "2024-10-30",
    description: "Clé API Gateway RSA 2048 bits",
    icon: IoKeyOutline,
  },
  {
    type: "Import de clé",
    date: "2024-10-30",
    description: "Import d'une clé publique au format PEM",
    icon: FiDownload,
  },
  {
    type: "Export de clé",
    date: "2024-10-30",
    description: "Export d'une clé publique au format PEM",
    icon: FiUpload,
  },
  {
    type: "Visualisation de clé",
    date: "2024-10-30",
    description: "Visualisation de la clé API Gateway",
    icon: FaRegEye,
  },
  {
    type: "Suppression de clé",
    date: "2024-10-30",
    description: "Suppression de la clé API Gateway",
    icon: FaRegTrashCan,
  },
  {
    type: "Suppression de clé",
    date: "2024-10-30",
    description: "Suppression de la clé API Gateway",
    icon: FaRegTrashCan,
  },
  {
    type: "Suppression de clé",
    date: "2024-10-30",
    description: "Suppression de la clé API Gateway",
    icon: FaRegTrashCan,
  },
  {
    type: "Suppression de clé",
    date: "2024-10-30",
    description: "Suppression de la clé API Gateway",
    icon: FaRegTrashCan,
  },
  {
    type: "Suppression de clé",
    date: "2024-10-30",
    description: "Suppression de la clé API Gateway",
    icon: FaRegTrashCan,
  },
  {
    type: "Suppression de clé",
    date: "2024-10-30",
    description: "Suppression de la clé API Gateway",
    icon: FaRegTrashCan,
  },
  {
    type: "Suppression de clé",
    date: "2024-10-30",
    description: "Suppression de la clé API Gateway",
    icon: FaRegTrashCan,
  },
  {
    type: "Suppression de clé",
    date: "2024-10-30",
    description: "Suppression de la clé API Gateway",
    icon: FaRegTrashCan,
  },
  {
    type: "Suppression de clé",
    date: "2024-10-30",
    description: "Suppression de la clé API Gateway",
    icon: FaRegTrashCan,
  },
  {
    type: "Suppression de clé",
    date: "2024-10-30",
    description: "Suppression de la clé API Gateway",
    icon: FaRegTrashCan,
  },
  {
    type: "Suppression de clé",
    date: "2024-10-30",
    description: "Suppression de la clé API Gateway",
    icon: FaRegTrashCan,
  },
  {
    type: "Suppression de clé",
    date: "2024-10-30",
    description: "Suppression de la clé API Gateway",
    icon: FaRegTrashCan,
  },
];

export default function Log() {
  return (
    <main className="flex size-full flex-col gap-4 bg-secondary p-4">
      <header className="flex flex-col gap-2 pt-4">
        <div className="flex items-center gap-2">
          <LuHistory size={24} />
          <h1 className="text-2xl font-semibold">Historique</h1>
        </div>
        <p>Enregistre toutes les opérations liées aux clés</p>
      </header>
      <Card className="h-screen overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="h-14">
              <TableHead>Type</TableHead>
              <TableHead>Date et heure</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log, index) => (
              <TableRow key={index}>
                <TableCell className="flex h-16 items-center justify-start gap-2 font-medium">
                  <log.icon />
                  {log.type}
                </TableCell>
                <TableCell className="h-16">{log.date}</TableCell>
                <TableCell className="h-16">{log.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </main>
  );
}
