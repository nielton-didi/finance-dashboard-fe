"use client"

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

export default function OrganizationSettingsPage() {
  function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    // TODO: replace with a real API call to the backend once it's available
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
            <Field>
              <FieldLabel htmlFor="org-name">Organization Name</FieldLabel>
              <Input id="org-name" placeholder="Acme Inc" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="org-registration">
                Registration Number
              </FieldLabel>
              <Input id="org-registration" placeholder="202601012345" />
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button type="submit">Save</Button>
        </CardFooter>
      </form>
    </Card>
  )
}
