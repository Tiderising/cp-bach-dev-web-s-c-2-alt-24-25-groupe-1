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
import axios from "axios";
import { useState } from "react";
import { TbCirclePlus } from "react-icons/tb";

type Algorithm = "rsa" | "ecdsa";

const GenerateKey = () => {
  const [algorithm, setAlgorithm] = useState<Algorithm>("rsa");
  const [keyLength, setKeyLength] = useState<string>("2048");
  const [keyName, setKeyName] = useState<string>("");

  const keyLengths = {
    rsa: ["2048", "3072", "4096"],
    ecdsa: ["256", "384", "521"],
  };

  const handleSubmit = () => {
    console.log("algorithm", algorithm);
    console.log("key length", keyLength);
    console.log("key name", keyName);

    if (!algorithm || (algorithm !== "rsa" && algorithm !== "ecdsa")) {
      console.error("Invalid algorithm");
      return;
    }

    if (
      typeof keyLength !== "string" ||
      !keyLengths[algorithm].includes(keyLength)
    ) {
      console.error("Invalid key length");
      return;
    }

    axios.post("/api/generate-key", {
      algorithm,
      keyLength: keyLength,
      keyName,
    });
  };

  return (
    <main className="flex size-full items-center justify-center bg-secondary">
      <Card>
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
          <form action={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <p>Algorithme de la clé</p>
              <RadioGroup
                className="flex gap-4"
                value={algorithm}
                onValueChange={(value: Algorithm) => setAlgorithm(value)}
              >
                <div className="flex items-center justify-center gap-2">
                  <RadioGroupItem id="rsa" value="rsa" />
                  <Label htmlFor="rsa">RSA</Label>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <RadioGroupItem id="ecdsa" value="ecdsa" />
                  <Label htmlFor="ecdsa">ECDSA</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Longueur de la clé</Label>
              <Select onValueChange={(value: string) => setKeyLength(value)}>
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