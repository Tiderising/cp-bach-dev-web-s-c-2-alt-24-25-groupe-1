import Link from "next/link";

const Sidebar = () => {
  return (
    <div className="">
      <ul>
        <li>
          <Link href="/crm/">Dashboard</Link>
        </li>
        <li>
          <Link href="/crm/generate-key">Generate Keys</Link>
        </li>
        <li>
          <Link href="/crm/import-key">Imports Keys</Link>
        </li>
        <li>
          <Link href="/crm/log">Logs</Link>
        </li>
        <li>
          <Link href="/crm/settings">Settings</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
