"use client"

import { useState } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { updateProfile } from "@/lib/actions/account"
import type { CurrentUser } from "@/lib/auth"

export function ProfileForm({ user }: { user: CurrentUser }) {
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
      const result = await updateProfile({
        fullName: String(formData.get("full-name") ?? ""),
        phone: String(formData.get("phone") ?? "") || undefined,
      })

      if (!result.ok) {
        setError(result.message ?? "Failed to save profile")
        return
      }

      setSaved(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>
          Your personal details shown across the dashboard.
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
              <FieldLabel htmlFor="full-name">Full Name</FieldLabel>
              <Input
                id="full-name"
                name="full-name"
                defaultValue={user.fullName}
                placeholder="Jane Doe"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                defaultValue={user.email}
                disabled
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+60 12-345 6789"
              />
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="justify-end gap-2">
          {saved && (
            <span className="text-sm text-muted-foreground">Saved</span>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
