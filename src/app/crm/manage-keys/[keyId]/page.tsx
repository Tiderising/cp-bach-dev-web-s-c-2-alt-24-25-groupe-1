"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import axios from "axios";
import { use, useEffect, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const ViewKeyPage = ({ params }: { params: Promise<{ keyId: number }> }) => {
  const { keyId } = use(params);

  const [publicKey, setPublicKey] = useState<string>("");
  const [privateKey, setPrivateKey] = useState<string>("");
  const [showPrivateKey, setShowPrivateKey] = useState<boolean>(false);

  useEffect(() => {
    axios.get(`/api/keys/${keyId}`).then((res) => {
      const { publicKey } = res.data;
      setPublicKey(publicKey);
    });

    axios.get(`/api/keys/${keyId}/private`).then((res) => {
      const { privateKey } = res.data;
      setPrivateKey(privateKey);
    });
  }, [keyId]);

  const togglePrivateKeyVisibility = () => {
    setShowPrivateKey(!showPrivateKey);
  };

  return (
    <main className="flex size-full flex-col items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-screen-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FaRegEye size={32} />
            <h1 className="text-3xl font-bold">Afficher sa clé</h1>
          </div>
          <p className="text-sm text-gray-500">
            Afficher sa clé publique et récupérer sa clé privée
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg">Clé publique</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="whitespace-pre-wrap break-words">
                  {publicKey}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg">Clé privée</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={togglePrivateKeyVisibility}
              >
                {showPrivateKey ? <FaRegEyeSlash /> : <FaRegEye />}
              </Button>
            </div>
            <Card>
              <CardContent className="pt-6">
                <div className="whitespace-pre-wrap break-words">
                  {showPrivateKey
                    ? privateKey
                    : "••••••••••••••••••••••••••••••••••"}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default ViewKeyPage;
