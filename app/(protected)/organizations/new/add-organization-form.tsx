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
import { createOrganization } from "@/lib/actions/organizations"
import { cn } from "@/lib/utils"

export function AddOrganizationForm() {
  const router = useRouter()
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

      router.push(
        result.data ? `/organizations/${result.data.id}/settings` : "/"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Organization</CardTitle>
        <CardDescription>
          Creates a new organization. You can configure its Autocount database
          connection afterwards from its Settings page.
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
              <FieldLabel htmlFor="new-org-name">Organization Name</FieldLabel>
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
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
            Cancel
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Organization"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
