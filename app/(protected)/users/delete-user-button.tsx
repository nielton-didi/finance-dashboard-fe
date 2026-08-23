"use client"

import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog"
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

  return (
    <ConfirmDeleteDialog
      trigger={
        <Button
          type="button"
          variant="destructive"
          size="sm"
          disabled={disabled}
        >
          Delete
        </Button>
      }
      title="Delete user"
      description={`Delete ${userName}? This cannot be undone.`}
      onConfirm={async () => {
        const result = await deleteUser(userId)

        if (result.ok) {
          if (redirectTo) {
            router.push(redirectTo)
          } else {
            router.refresh()
          }
        }

        return result
      }}
    />
  )
}
