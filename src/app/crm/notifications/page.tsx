"use client";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Notification } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";
import { IoNotifications } from "react-icons/io5";

export default function NotificationPage() {
  const [notification, setNotification] = useState<Notification[]>([
    // Placeholder data
    {
      id: 1,
      title: "Génération de clé",
      userId: "1",
      createdAt: new Date("2024-10-30"),
      message: "Clé API Gateway RSA 2048 bits",
      updatedAt: new Date("2024-10-30"),
      isRead: false,
    },
    {
      id: 2,
      title: "Import de clé",
      userId: "1",
      createdAt: new Date("2024-10-30"),
      message: "Import d'une clé publique au format PEM",
      updatedAt: new Date("2024-10-30"),
      isRead: false,
    },
    {
      id: 3,
      title: "Export de clé",
      userId: "1",
      createdAt: new Date("2024-10-30"),
      message: "Export d'une clé publique au format PEM",
      updatedAt: new Date("2024-10-30"),
      isRead: false,
    }
    // Add more placeholder data as needed
  ]);

  const [isLoading, setIsLoading] = useState(true);
  const [erreur, setErreur] = useState({
    error: false,
    message: "",
  });

  useEffect(() => {
    axios
      .get("/api/notification")
      .then((response) => {
        setNotification(response.data);
      })
      .then(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setErreur({
          error: true,
          message:
            "Une erreur s'est produite lors du chargement des notifications",
        });
        setIsLoading(false);
      });

    // Mark all notifications as read when the page loads
    markAllAsRead();
  }, []);

  const toggleReadStatus = (id: number) => {
    
  };

  const markAllAsRead = () => {
    // Request to mark all notifications as read
    axios
     .patch(`/api/notification/read-all/`) // Replace with actual userId
     .then((response) => {
        console.log(response.data);
      })
     .catch((error) => {
        console.log(error);
        setErreur({
          error: true,
          message: "Une erreur s'est produite lors de la mise à jour des notifications",
        });
      });
  };

  if (isLoading) {
    return (
      <main className="flex size-full flex-col gap-4 bg-secondary p-4 text-center">
        <header className="flex flex-col gap-2 pt-4">
          <div className="flex items-center gap-2">
            <IoNotifications size={24} />
            <h1 className="text-2xl font-semibold">Notifications</h1>
          </div>
        </header>
        <div className="flex w-full justify-center">
          <p className="font-semibold text-yellow-500">Chargement des notifications...</p>
        </div>
      </main>
    );
  }

  if (erreur.error) {
    return (
      <main className="flex size-full flex-col gap-4 bg-secondary p-4 text-center">
        <header className="flex flex-col gap-2 pt-4">
          <div className="flex items-center gap-2">
            <IoNotifications size={24} />
            <h1 className="text-2xl font-semibold">Notifications</h1>
          </div>
        </header>
        <p className="text-red-500">{erreur.message}</p>
      </main>
    );
  }

  if (notification.length > 0) {
    return (
      <main className="flex size-full flex-col gap-4 bg-secondary p-4">
        <header className="flex flex-col gap-2 pt-4">
          <div className="flex items-center gap-2">
            <IoNotifications size={24} />
            <h1 className="text-2xl font-semibold">Notifications</h1>
          </div>
          <p>
            Notifications de toutes les actions importante efffecter sur le comtpe
          </p>
        </header>
        <Table>
          <TableHeader>
            <TableRow className="h-14">
              <TableHead>Type</TableHead>
              <TableHead>Date et heure</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Lu</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notification.map((notif, index) => (
              <TableRow key={index}>
                <TableCell>{notif.title}</TableCell>
                <TableCell>{notif.message}</TableCell>
                <TableCell>
                  {new Intl.DateTimeFormat("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                  }).format(new Date(notif.createdAt))}
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={notif.isRead}
                    onCheckedChange={() => toggleReadStatus(notif.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
    );
  }

  return (
    <main className="flex size-full flex-col gap-4 bg-secondary p-4 text-center">
      <header className="flex flex-col gap-2 pt-4">
        <div className="flex items-center gap-2">
          <IoNotifications size={24} />
          <h1 className="text-2xl font-semibold">Notifications</h1>
        </div>
      </header>
      <p className="font-semibold text-blue-500">Aucune notification disponible</p>
    </main>
  );
}