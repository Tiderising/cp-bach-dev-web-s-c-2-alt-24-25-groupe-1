"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import axios from "axios";
import { useRouter } from "next/navigation";
import { use } from "react";
import toast from "react-hot-toast";
import { FaRegTrashCan } from "react-icons/fa6";

const Delete = ({ params }: { params: Promise<{ keyId: number }> }) => {
  const { keyId } = use(params);
  const router = useRouter();

  const handleDelete = async () => {
    toast
      .promise(axios.delete(`/api/keys/${keyId}`).then((res) => {
        
        console.log("------------------------------------");        
        console.log(res);
        console.log("------------------------------------");

        axios.post("/api/notification", {
          title: "Clé supprimée",
          message: `La clé "${res.data.keyName}" N°${keyId} a été supprimée avec succès`,
        });

        router.back();
      })
      , {
        loading: "Suppression de la clé...",
        success: "Clé supprimée avec succès",
        error: "Erreur lors de la suppression de la clé",
      })
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="flex size-full items-center justify-center bg-secondary">
      <Card>
        <CardHeader>
          <div className="flex gap-2">
            <FaRegTrashCan size={32} />
            <h1 className="text-2xl">Supprimer une clé</h1>
          </div>
          <p>
            Êtes-vous sûr de vouloir supprimer cette clé ? Cette action est
            irréversible.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button onClick={handleDelete} variant="destructive">
              Supprimer
            </Button>
            <Button onClick={handleCancel} variant="outline">
              Annuler
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Delete;
