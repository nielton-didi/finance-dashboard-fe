"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { updateUser } from "@/lib/actions/users"
import type { User } from "@/lib/users"

import { DeleteUserButton } from "../delete-user-button"

export function UserInfoCard({
  user,
  isSelf,
}: {
  user: User
  isSelf: boolean
}) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSaved(false)
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)

    try {
      const result = await updateUser(user.id, {
        fullName: String(formData.get("full-name") ?? ""),
        phone: String(formData.get("phone") ?? "") || undefined,
        role: isSelf
          ? user.role
          : formData.get("role") === "admin"
            ? "admin"
            : "staff",
        status: formData.get("status") === "invited" ? "invited" : "active",
      })

      if (!result.ok) {
        setError(result.message ?? "Failed to save user")
        return
      }

      setSaved(true)
      router.refresh()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Information</CardTitle>
        <CardDescription>
          Basic details and account role for {user.fullName}.
        </CardDescription>
      </CardHeader>
      <form className="contents" onSubmit={handleSave}>
        <CardContent>
          <FieldGroup>
            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
            <Field>
              <FieldLabel htmlFor="user-full-name">Full Name</FieldLabel>
              <Input
                id="user-full-name"
                name="full-name"
                defaultValue={user.fullName}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="user-email">Email</FieldLabel>
              <Input id="user-email" defaultValue={user.email} disabled />
            </Field>
            <Field>
              <FieldLabel htmlFor="user-phone">
                Phone Number (optional)
              </FieldLabel>
              <Input
                id="user-phone"
                name="phone"
                type="tel"
                defaultValue={user.phone ?? ""}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="user-role">Role</FieldLabel>
              <select
                id="user-role"
                name="role"
                defaultValue={user.role}
                disabled={isSelf}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 dark:bg-input/30"
              >
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
              {isSelf && (
                <p className="text-xs text-muted-foreground">
                  You can&apos;t change your own role.
                </p>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="user-status">Status</FieldLabel>
              <select
                id="user-status"
                name="status"
                defaultValue={user.status}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              >
                <option value="active">Active</option>
                <option value="invited">Invited</option>
              </select>
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="justify-between gap-2">
          <DeleteUserButton
            userId={user.id}
            userName={user.fullName}
            disabled={isSelf}
            redirectTo="/users"
          />
          <div className="flex items-center gap-2">
            {saved && (
              <span className="text-sm text-muted-foreground">Saved</span>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
