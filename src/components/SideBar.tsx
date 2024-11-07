import Link from "next/link";
import { IoKeyOutline, IoSettingsOutline } from "react-icons/io5";
import { LuHistory, LuImport } from "react-icons/lu";
import { TbCirclePlus } from "react-icons/tb";
import { Button } from "./ui/button";

const Links = [
  {
    title: "Générer une clé",
    href: "/crm/generate-key",
    icon: TbCirclePlus,
  },
  {
    title: "Gérer les clés",
    href: "/crm/manage-keys",
    icon: IoKeyOutline,
  },
  {
    title: "Importer une clé",
    href: "/crm/import-key",
    icon: LuImport,
  },
  {
    title: "Historique",
    href: "/crm/log",
    icon: LuHistory,
  },
  {
    title: "Paramètres",
    href: "/crm/settings",
    icon: IoSettingsOutline,
  },
];

const Sidebar = () => {
  return (
    <div className="flex h-full w-fit flex-col gap-6 border-r p-4">
      <Link href="/crm" className="text-2xl font-bold">
        Secu-tech
      </Link>
      <ul className="flex flex-col gap-4">
        {Links.map((link, index) => (
          <li key={index}>
            <Button variant="ghost" className="flex w-full justify-start gap-4">
              <link.icon size={24} />
              <Link href={link.href} className="text-base">
                {link.title}
              </Link>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
