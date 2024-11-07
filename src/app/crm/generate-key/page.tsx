"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { TbCirclePlus } from "react-icons/tb";
import axios from "axios";

enum KeyAlgorithm {
  RSA = "RSA",
  ECDSA = "ECDSA",
}

const GenerateKey = () => {
  const [algorithm, setAlgorithm] = useState<KeyAlgorithm>(KeyAlgorithm.RSA);
  const [keyLength, setKeyLength] = useState<string>("");
  const [keyName, setKeyName] = useState<string>("");

  const keyLengths = {
    RSA: ["2048", "3072", "4096"],
    ECDSA: ["256", "384", "521"],
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    axios
      .post("/api/generate-key", JSON.stringify({
            algorithm: algorithm,
            modulusLength: algorithm === KeyAlgorithm.RSA ? parseInt(keyLength) : undefined,
            namedCurve: algorithm === KeyAlgorithm.ECDSA ? `P-${keyLength}` : undefined,
            keyName,
          }),
      )
      .then((response) => {
        if (response.status === 201) {
          alert("Key generated successfully");
        }
      })
      .catch((error) => {
        console.error("Error while generating key: ", error);
        alert("Error while generating key");
      });
  };

  return (
    <main className="flex size-full items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex gap-2">
            <TbCirclePlus size={32} />
            <h1 className="text-2xl">Générer une nouvelle clé</h1>
          </div>
          <p>
            Générer une nouvelle clé cryptographique pour votre opération
            sécurisée
          </p>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <p>Algorithme de la clé</p>
              <RadioGroup
                className="flex gap-4"
                value={algorithm}
                onValueChange={(value: KeyAlgorithm) => setAlgorithm(value)}
              >
                <div className="flex items-center justify-center gap-2">
                  <RadioGroupItem id="rsa" value={KeyAlgorithm.RSA} />
                  <Label htmlFor="rsa">RSA</Label>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <RadioGroupItem id="ecdsa" value={KeyAlgorithm.ECDSA} />
                  <Label htmlFor="ecdsa">ECDSA</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Longueur de la clé</Label>
              <Select onValueChange={setKeyLength}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner la longueur de la clé" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {keyLengths[algorithm].map((length) => (
                      <SelectItem key={length} value={length}>
                        {length} bits
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Nom de la clé</Label>
              <Input
                placeholder="Entrer le nom de la clé"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
              />
            </div>
            <Button type="submit">Générer la clé</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};

export default GenerateKey;
