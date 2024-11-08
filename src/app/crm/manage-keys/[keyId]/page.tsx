"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import PublicKeyDisplay from "@/components/PublicKeyDisplay";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import crypto from "crypto";

const ViewKeyPage = () => {
  const searchParams = useSearchParams();
  const keyId = searchParams.get("keyId");

  const [keyName, setKeyName] = useState<string>("");
  const [publicKey, setPublicKey] = useState<string>("");
  const [algorithm, setAlgorithm] = useState<string>("");
  const [keySize, setKeySize] = useState<number>(0);
  const [fingerprint, setFingerprint] = useState<string>("");
  const [linkExpiration, setLinkExpiration] = useState<string>("15 minutes");
  const [allowDownload, setAllowDownload] = useState<boolean>(true);

  useEffect(() => {
    if (!keyId) return;

    const fetchPublicKey = async () => {
      try {
        const response = await axios.get("/api/get-public-key", {
          params: { keyId },
          headers: {
            'Allow-Download': allowDownload.toString(),
          },
        });
        console.log("Données de la clé publique :", response.data);
        setKeyName(response.data.keyName);
        setPublicKey(response.data.publicKey);
        setAlgorithm(response.data.algorithm);
        setKeySize(response.data.keySize);

        // Calculate the fingerprint
        const hash = crypto.createHash('sha256');
        hash.update(response.data.publicKey);
        setFingerprint(hash.digest('hex'));
      } catch (error) {
        console.error("Erreur lors de la récupération de la clé publique :", error);
      }
    };

    fetchPublicKey();
  }, [keyId, allowDownload]);

  return (
    <main className="flex size-full flex-col items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <h1 className="text-3xl font-bold">Share Public Key</h1>
          <p className="text-sm text-gray-500">Create a secure, temporary link to share your public key</p>
        </CardHeader>
        <CardContent>
          <h2 className="text-2xl font-semibold mt-6">Public Key Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="mb-2"><strong>Nom de la clé:</strong> {keyName}</p>
              <p className="mb-2"><strong>Taille de la clé:</strong> {keySize} bits</p>
            </div>
            <div>
              <p className="mb-2"><strong>Algorithme:</strong> {algorithm}</p>
              <p className="mb-2"><strong>Empreinte:</strong> {fingerprint}</p>
            </div>
          </div>
          <PublicKeyDisplay keyName={keyName} publicKey={publicKey} algorithm={algorithm} keySize={keySize} fingerprint={fingerprint} allowDownload={allowDownload} />
          
          <h2 className="text-2xl font-semibold mt-6">Share Settings</h2>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Link Expiration</label>
            <select
              value={linkExpiration}
              onChange={(e) => setLinkExpiration(e.target.value)}
              className="border p-2 rounded mt-1"
            >
              <option value="15 minutes">15 minutes</option>
              <option value="30 minutes">30 minutes</option>
              <option value="1 hour">1 hour</option>
              <option value="2 hours">2 hours</option>
              <option value="4 hours">4 hours</option>
            </select>
          </div>
          <div className="mt-4 flex items-center">
            <label className="block text-sm font-medium text-gray-700 mr-2">Allow Download</label>
            <input
              type="checkbox"
              checked={allowDownload}
              onChange={() => setAllowDownload(!allowDownload)}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default ViewKeyPage;