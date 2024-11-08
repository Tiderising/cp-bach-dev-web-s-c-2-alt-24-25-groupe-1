"use client";

import { signOut } from "next-auth/react";

const signOutBtn = () => {
  return (
    <div>
      <button
        className="custom-btn bg-dark text-white"
        onClick={async () => await signOut()}
      >
        Log Out
      </button>
    </div>
  );
};

export default signOutBtn;
