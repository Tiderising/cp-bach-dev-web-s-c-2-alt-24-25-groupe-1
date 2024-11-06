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
import { IoKeyOutline } from "react-icons/io5";

const GenerateKey = () => {
  return (
    <main className="flex size-full items-center justify-center">
      <Card>
        <CardHeader>
          <div className="flex gap-2">
            <IoKeyOutline size={32} />
            <h1 className="text-2xl">Générer une nouvelle clé</h1>
          </div>
          <p>
            Générer une nouvelle clé cryptographique pour votre opération
            sécurisée
          </p>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <p>Algorithme de la clé</p>
              <RadioGroup className="flex gap-4">
                <div className="flex items-center justify-center gap-2">
                  <RadioGroupItem value="rsa" />
                  <Label>RSA</Label>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <RadioGroupItem value="ecdsa" />
                  <Label>ECDSA</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Longueur de la clé</Label>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sélectionner la longueur de la clé" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="2048">2048 bits</SelectItem>
                    <SelectItem value="3072">3072 bits</SelectItem>
                    <SelectItem value="4096">4096 bits</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Nom de la clé</Label>
              <Input placeholder="Entrer le nom de la clé" />
            </div>
            <Button type="submit">Générer la clé</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};

export default GenerateKey;
