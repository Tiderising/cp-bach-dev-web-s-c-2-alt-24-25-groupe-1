import { IoKeyOutline, IoSettingsOutline } from "react-icons/io5";

export default function ManageKeys() {
  return (
    <main className="p-4 size-full">
      {/* En-tête du paramètre */}
      <div className="flex items-center gap-4 mb-8">
        <IoSettingsOutline size={40} />
        <p className="font-semibold text-4xl">Paramètre</p>
      </div>

      {/* Conteneur pour les sessions actives */}
      <section className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Sessions Actives</h2>
        <div className="space-y-4">
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
        </div>
      </section>
    </main>
  );
}

// Composant individuel pour afficher chaque session active
function SessionItem({ ip, browser, date, location }) {
  return (
    <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-300 dark:border-gray-600">
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
      <button className="text-red-500 hover:underline text-sm">
        Déconnecter
      </button>
    </div>
  );
}
