"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdDriveFileRenameOutline } from "react-icons/md";

const Rename = ({ params }: { params: Promise<{ keyId: number }> }) => {
  const [keyName, setKeyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { keyId } = use(params);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    axios.get(`/api/keys/${keyId}`).then((res) => {
      setKeyName(res.data.keyName);
      setIsLoading(false);
    });
  }, [keyId]);

  const handleRename = async () => {
    toast
      .promise(axios.patch(`/api/keys/${keyId}`, JSON.stringify({ keyName })), {
        loading: "Renommage de la clé...",
        success: "Clé renommée avec succès",
        error: "Erreur lors du renommage de la clé",
      })
      .then(() => router.back());
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="flex size-full items-center justify-center bg-secondary">
      <Card>
        <CardHeader>
          <div className="flex gap-2">
            <MdDriveFileRenameOutline size={32} />
            <h1 className="text-2xl">Renommer la clé</h1>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {isLoading ? (
            <>
              <div>
                <Skeleton className="mb-2 h-5 w-24" />
                <Skeleton className="h-9 w-full" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-24" />
              </div>
            </>
          ) : (
            <>
              <div>
                <Label htmlFor="keyName">Nom de la clé</Label>
                <Input
                  id="keyName"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleRename} variant="destructive">
                  Renommer
                </Button>
                <Button onClick={handleCancel} variant="outline">
                  Annuler
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Rename;
