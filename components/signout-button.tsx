"use client"

import { signOut } from "@/lib/auth-client"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"

export function SignoutButton() {
  const router = useRouter()

  return (
    <Button
      variant="outline"
      onClick={() =>
        signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push("/login") // redirect to login page
            },
          },
        })
      }
    >
      Sign out
    </Button>
  )
}
