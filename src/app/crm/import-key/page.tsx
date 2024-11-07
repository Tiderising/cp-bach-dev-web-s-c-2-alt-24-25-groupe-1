import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LuImport } from "react-icons/lu";

export default function ImportKey() {
  return (
    <main className="flex size-full items-center justify-center bg-secondary">
      <Card>
        <CardHeader>
          <div className="flex gap-2">
            <LuImport size={32} />
            <h1 className="text-2xl">Importer une clé</h1>
          </div>
          <p>Importe ta clé cryptographique au format PEM ou DER</p>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="key">
                Selectionne ta clé (au format PEM ou DER)
              </Label>
              <Input id="key" type="file" />
            </div>
            <Button type="submit">
              <LuImport />
              Importer
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
