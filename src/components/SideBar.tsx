import Link from 'next/link';
import React from 'react';

const Sidebar = () => {
  return (
    <div className="sidebar">
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