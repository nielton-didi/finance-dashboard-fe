"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { deleteUser } from "@/lib/actions/users"

export function DeleteUserButton({
  userId,
  userName,
  disabled,
  redirectTo,
}: {
  userId: number
  userName: string
  disabled?: boolean
  redirectTo?: string
}) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    if (!window.confirm(`Delete ${userName}? This cannot be undone.`)) {
      return
    }

    setIsDeleting(true)
    try {
      const result = await deleteUser(userId)

      if (!result.ok) {
        window.alert(result.message ?? "Failed to delete user")
        return
      }

      if (redirectTo) {
        router.push(redirectTo)
      } else {
        router.refresh()
      }
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Button
      type="button"
      variant="destructive"
      size="sm"
      disabled={disabled || isDeleting}
      onClick={handleDelete}
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </Button>
  )
}
