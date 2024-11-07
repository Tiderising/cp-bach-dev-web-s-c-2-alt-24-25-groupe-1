"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

interface SignInFormProps {
  csrfToken: string;
}

const SignInForm: React.FC<SignInFormProps> = ({ csrfToken }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Check your email for the magic link!");
    // You can add more logic here, like form validation or API calls
  };

  return <div className=""></div>;
};

export default SignInForm;
