  "use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { IoSettingsOutline } from "react-icons/io5";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

type SessionItemProps = {
  ip: string;
  browser: string;
  date: string;
  location: string;
};

export default function ManageKeys() {
  const session = useSession();
  const twoFactorEnabled = (session.data?.user as { twoFactorEnabled?: boolean })?.twoFactorEnabled;
  const [is2FAEnabled, setIs2FAEnabled] = useState(twoFactorEnabled || false);

  useEffect(() => {
    setIs2FAEnabled(twoFactorEnabled || false);
  }, [twoFactorEnabled]);

  const toggle2FA = async () => {
    try {
      const response = await toast.promise(
        axios.patch('/api/toggle2FA').then((res) => 
          setIs2FAEnabled(res.data.twoFactorEnabled)
        ),
        {
          loading: 'Toggling 2FA...',
          success: '2FA toggled successfully ' + (is2FAEnabled ? 'disabled' : 'enabled'),
          error: 'Failed to toggle 2FA',
        }
      );

      console.log(response);
    
    } catch (error) {
      console.error('Failed to toggle 2FA:', error);
    }
  };

  return (
    <main className="flex size-full flex-col gap-4 bg-secondary p-4">
      <div className="flex items-center gap-2 pt-4">
        <IoSettingsOutline size={24} />
        <p className="text-2xl font-semibold">Paramètres</p>
      </div>

      <Card className="flex flex-col justify-center">
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
        <div className="flex justify-center">
          <Button
            onClick={toggle2FA}
            color="primary"
            className="mb-5 w-1/3"
          >
            {is2FAEnabled ? 'Désactiver 2FA' : 'Activer 2FA'}
          </Button>
        </div>
      </Card>
    </main>
  );
}

function SessionItem({ ip, browser, date, location }: SessionItemProps) {
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
      <div className="flex items-center gap-2">
        <button className="text-sm text-red-500 hover:underline">
          Déconnecter
        </button>
      </div>
    </div>
  );
}