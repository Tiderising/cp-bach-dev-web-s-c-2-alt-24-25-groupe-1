"use client"; // Ajouter cette ligne au début du fichier

import { Button } from "@/components/ui/button";
import { IoKeyOutline } from "react-icons/io5";
import { TbCirclePlus } from "react-icons/tb";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function ManageKeys() {
  const keysData = [
    {
      name: "Clef 1",
      type: "RSA",
      size: "2048 bits",
      createdAt: "2024-11-06",
    },
    {
      name: "Clef 2",
      type: "AES",
      size: "256 bits",
      createdAt: "2024-10-01",
    },
  ];

  return (
    <main className="p-4 w-full">
      <div className="flex items-center gap-4 mb-8">
        <IoKeyOutline size={40} />
        <p className="font-semibold text-4xl">Management des clefs</p>
      </div>

      <div className="flex items-center gap-4 mb-4 justify-between w-full">
        <Input
          className="w-80"
          type="text"
          placeholder="Rechercher une clef..."
        />
        <Button>
          <TbCirclePlus />
          Générer une clef
        </Button>
      </div>

      <table className="min-w-full bg-white border border-gray-300 rounded-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 text-left">Nom de la clef</th>
            <th className="px-4 py-2 text-left">Type</th>
            <th className="px-4 py-2 text-left">Taille</th>
            <th className="px-4 py-2 text-left">Date de création</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {keysData.map((key, index) => (
            <tr key={index} className="border-b border-gray-300">
              <td className="px-4 py-2">{key.name}</td>
              <td className="px-4 py-2">{key.type}</td>
              <td className="px-4 py-2">{key.size}</td>
              <td className="px-4 py-2">{key.createdAt}</td>
              <td className="px-4 py-2">
                <DropdownActions />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

function DropdownActions() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="px-2 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Actions
      </Button>
      {isOpen && (
        <div className="absolute mt-2 right-0 bg-white border border-gray-300 rounded-lg shadow-lg">
          <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
            Modifier
          </button>
          <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
            Supprimer
          </button>
        </div>
      )}
    </div>
  );
}
