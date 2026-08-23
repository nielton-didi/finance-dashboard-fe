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
import { updateOrganization } from "@/lib/actions/organizations"
import type { Organization } from "@/lib/organizations"

import { DeleteOrganizationButton } from "./delete-organization-button"

export function OrganizationForm({
  orgId,
  organization,
}: {
  orgId: number
  organization: Organization
}) {
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
      const result = await updateOrganization(orgId, {
        name: String(formData.get("org-name") ?? ""),
        registrationNumber:
          String(formData.get("org-registration") ?? "") || undefined,
      })

      if (!result.ok) {
        setError(result.message ?? "Failed to save organization")
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
        <CardTitle>Organization</CardTitle>
        <CardDescription>
          General information about this organization.
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
              <FieldLabel htmlFor="org-name">Organization Name</FieldLabel>
              <Input
                id="org-name"
                name="org-name"
                defaultValue={organization.name}
                placeholder="Acme Inc"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="org-registration">
                Registration Number
              </FieldLabel>
              <Input
                id="org-registration"
                name="org-registration"
                defaultValue={organization.registrationNumber ?? ""}
                placeholder="202601012345"
              />
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="justify-between gap-2">
          <DeleteOrganizationButton orgId={orgId} orgName={organization.name} />
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
