"use client"

import { useState } from "react";
import { Input, Button } from "@nextui-org/react";
import { toast } from "react-hot-toast";
import { div } from "framer-motion/client";

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

  return (
    <div className="">
      <form onSubmit={handleSubmit} className="space-y-6">
      <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email address
        </label>

        <Input 
          size={"sm"} 
          type="email" 
          label="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <Button type="submit" fullWidth color="primary">
        Sign in with Email
      </Button>
    </form>
    </div>
  );
};

export default SignInForm;