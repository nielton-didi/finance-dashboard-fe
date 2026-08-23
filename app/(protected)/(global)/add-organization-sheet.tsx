"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { createOrganization } from "@/lib/actions/organizations"

export function AddOrganizationSheet() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)

    try {
      const result = await createOrganization({
        name: String(formData.get("org-name") ?? ""),
        registrationNumber:
          String(formData.get("org-registration") ?? "") || undefined,
        plan: String(formData.get("org-plan") ?? "") || undefined,
      })

      if (!result.ok) {
        setError(result.message ?? "Failed to add organization")
        return
      }

      setOpen(false)
      event.currentTarget.reset()
      router.refresh()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) setError(null)
      }}
    >
      <SheetTrigger render={<Button />}>
        <PlusIcon />
        New Organization
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>New Organization</SheetTitle>
          <SheetDescription>
            Creates a new organization. You can configure its Autocount
            database connection afterwards from its Settings page.
          </SheetDescription>
        </SheetHeader>
        <form
          className="flex flex-1 flex-col gap-4 overflow-y-auto px-4"
          onSubmit={handleSubmit}
        >
          <FieldGroup>
            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
            <Field>
              <FieldLabel htmlFor="new-org-name">
                Organization Name
              </FieldLabel>
              <Input
                id="new-org-name"
                name="org-name"
                placeholder="Acme Inc"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="new-org-registration">
                Registration Number (optional)
              </FieldLabel>
              <Input
                id="new-org-registration"
                name="org-registration"
                placeholder="202601012345"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="new-org-plan">Plan (optional)</FieldLabel>
              <Input id="new-org-plan" name="org-plan" placeholder="Pro" />
            </Field>
          </FieldGroup>
          <SheetFooter className="mt-auto px-0">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Organization"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
