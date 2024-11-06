"use client"
import React from "react";
import { SignIn } from "@/components/sign-in";
import { useSession } from "next-auth/react";

const SignInForm: React.FC = () => {

  const session = useSession();

  return (
    <div className="">
      <SignIn />
    </div>
  );
};

export default SignInForm;