"use client"

import { signIn } from "next-auth/react"

export function SignIn() {
  const handleSignIn = async () => {
    await signIn("email")
  }

  return (
    <button onClick={handleSignIn}>
      Sign In
    </button>
  )
}