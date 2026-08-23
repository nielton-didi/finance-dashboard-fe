"use client"

import { useRef, useState } from "react"

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
import { updatePassword } from "@/lib/actions/account"

export function SecurityForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSaved(false)

    const formData = new FormData(event.currentTarget)
    const newPassword = String(formData.get("new-password") ?? "")
    const confirmPassword = String(formData.get("confirm-password") ?? "")

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation don't match")
      return
    }

    setIsSubmitting(true)

    try {
      const result = await updatePassword({
        currentPassword: String(formData.get("current-password") ?? ""),
        newPassword,
      })

      if (!result.ok) {
        setError(result.message ?? "Failed to change password")
        return
      }

      formRef.current?.reset()
      setSaved(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security</CardTitle>
        <CardDescription>Change the password used to sign in.</CardDescription>
      </CardHeader>
      <form className="contents" ref={formRef} onSubmit={handleSave}>
        <CardContent>
          <FieldGroup>
            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
            <Field>
              <FieldLabel htmlFor="current-password">
                Current Password
              </FieldLabel>
              <Input
                id="current-password"
                name="current-password"
                type="password"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="new-password">New Password</FieldLabel>
              <Input
                id="new-password"
                name="new-password"
                type="password"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm New Password
              </FieldLabel>
              <Input
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
              />
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="justify-end gap-2">
          {saved && (
            <span className="text-sm text-muted-foreground">
              Password updated
            </span>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Password"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
