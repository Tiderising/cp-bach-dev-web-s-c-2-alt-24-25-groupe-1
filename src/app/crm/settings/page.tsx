import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { IoSettingsOutline } from "react-icons/io5";

export default function ManageKeys() {
  return (
    <main className="flex size-full flex-col gap-4 bg-secondary p-4">
      <div className="flex items-center gap-2 pt-4">
        <IoSettingsOutline size={24} />
        <p className="text-2xl font-semibold">Paramètres</p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg">Sessions Actives</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <SessionItem
            ip="Windows 10"
            browser="Chrome"
            date="2024-11-06"
            location="Paris, France"
          />
          <SessionItem
            ip="Mac OS"
            browser="Firefox"
            date="2024-11-05"
            location="Lyon, France"
          />
        </CardContent>
      </Card>
    </main>
  );
}

type SessionItem = {
  ip: string;
  browser: string;
  date: string;
  location: string;
};
function SessionItem({ ip, browser, date, location }: SessionItem) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-300 bg-white p-4 shadow dark:border-gray-600 dark:bg-gray-800">
      <div>
        <p className="font-medium">IP : {ip}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Navigateur : {browser}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Date de connexion : {date}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Localisation : {location}
        </p>
      </div>
      <button className="text-sm text-red-500 hover:underline">
        Déconnecter
      </button>
    </div>
  );
}