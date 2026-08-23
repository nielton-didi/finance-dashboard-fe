"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { UserPlusIcon } from "lucide-react"

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
import { createUser } from "@/lib/actions/users"

export function AddUserSheet() {
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
      const result = await createUser({
        fullName: String(formData.get("full-name") ?? ""),
        email: String(formData.get("email") ?? ""),
        phone: String(formData.get("phone") ?? "") || undefined,
        password: String(formData.get("password") ?? ""),
        role: formData.get("role") === "admin" ? "admin" : "staff",
      })

      if (!result.ok) {
        setError(result.message ?? "Failed to add user")
        return
      }

      setOpen(false)
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
        <UserPlusIcon />
        Add User
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add User</SheetTitle>
          <SheetDescription>
            This creates the account directly with the password you set below
            — there is no invite-email flow yet, so share the credentials
            with them separately.
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
              <FieldLabel htmlFor="new-user-full-name">Full Name</FieldLabel>
              <Input id="new-user-full-name" name="full-name" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="new-user-email">Email</FieldLabel>
              <Input
                id="new-user-email"
                name="email"
                type="email"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="new-user-phone">
                Phone Number (optional)
              </FieldLabel>
              <Input id="new-user-phone" name="phone" type="tel" />
            </Field>
            <Field>
              <FieldLabel htmlFor="new-user-password">Password</FieldLabel>
              <Input
                id="new-user-password"
                name="password"
                type="password"
                minLength={8}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="new-user-role">Role</FieldLabel>
              <select
                id="new-user-role"
                name="role"
                defaultValue="staff"
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              >
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </Field>
          </FieldGroup>
          <SheetFooter className="mt-auto px-0">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add User"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
