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

export default function DatabaseSettingsPage() {
  function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    // TODO: replace with a real API call to the backend once it's available
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AutoCount Database</CardTitle>
        <CardDescription>
          Connection details for this organization&apos;s AutoCount
          database. Report data such as the dashboard and the Profit &amp;
          Loss statement is fetched directly from here.
        </CardDescription>
      </CardHeader>
      <form className="contents" onSubmit={handleSave}>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="host">Host</FieldLabel>
              <Input id="host" placeholder="192.168.1.10" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="port">Port</FieldLabel>
              <Input id="port" placeholder="1433" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="database">Database Name</FieldLabel>
              <Input id="database" placeholder="ACSQL2008_CompanyName" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <Input id="username" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" type="password" required />
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
