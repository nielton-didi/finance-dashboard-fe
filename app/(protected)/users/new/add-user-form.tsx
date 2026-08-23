"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button, buttonVariants } from "@/components/ui/button"
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
import { createUser } from "@/lib/actions/users"
import { cn } from "@/lib/utils"

export function AddUserForm() {
  const router = useRouter()
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

      router.push(result.data ? `/users/${result.data.id}` : "/users")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add User</CardTitle>
        <CardDescription>
          This creates the account directly with the password you set below —
          there is no invite-email flow yet, so share the credentials with
          them separately.
        </CardDescription>
      </CardHeader>
      <form className="contents" onSubmit={handleSubmit}>
        <CardContent>
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
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Link
            href="/users"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Cancel
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add User"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
