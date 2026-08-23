"use client"

import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog"
import { deleteOrganization } from "@/lib/actions/organizations"

export function DeleteOrganizationButton({
  orgId,
  orgName,
}: {
  orgId: number
  orgName: string
}) {
  const router = useRouter()

  return (
    <ConfirmDeleteDialog
      trigger={
        <Button type="button" variant="destructive" size="sm">
          Delete Organization
        </Button>
      }
      title="Delete organization"
      description={
        <>
          This permanently deletes <strong>{orgName}</strong>, along with all
          user access grants and Autocount database credentials linked to it.
          This cannot be undone.
        </>
      }
      confirmValue={orgName}
      confirmButtonLabel="Delete organization"
      onConfirm={async () => {
        const result = await deleteOrganization(orgId)

        if (result.ok) {
          router.push("/")
        }

        return result
      }}
    />
  )
}
